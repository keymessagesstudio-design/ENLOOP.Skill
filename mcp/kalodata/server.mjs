#!/usr/bin/env node
/**
 * Kalodata / KaloPilot MCP server — stdio transport, zero dependencies.
 *
 * Kalodata publishes no MCP server of its own. What it does publish is the
 * KaloPilot agent behind an async HTTP API (submit a question, poll for the
 * answer). This wraps that API as MCP tools so any MCP client can reach TikTok
 * Shop data the same way it reaches everything else.
 *
 * Requires Node 18+ (global fetch, AbortSignal.timeout).
 */

import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const SERVER_INFO = { name: "kalodata", version: "0.1.0" };

// Newest first. We echo back the client's version when we know it, else ours.
const SUPPORTED_PROTOCOLS = ["2025-06-18", "2025-03-26", "2024-11-05"];

const DEFAULT_API_BASE =
  "https://staging.kalodata.com/api/pilot/skill/ext/v1";

const TOKEN_HELP = [
  "No KaloData token found.",
  "",
  "Get one:",
  "  1. Log in at https://kalodata.com/pilot",
  '  2. Bottom-left of the sidebar, click "Connect OpenClaw"',
  '  3. Copy the string under "Current Account Token" (a long hex string)',
  "",
  "Then either set KALODATA_TOKEN in the MCP server env, or save it to a file:",
  "  mkdir -p ~/.kalopilot && printf %s '<token>' > ~/.kalopilot/token && chmod 600 ~/.kalopilot/token",
].join("\n");

/** An error whose message is meant for the model, not the protocol layer. */
class ToolError extends Error {}

// ---------------------------------------------------------------- config

function config() {
  const home = os.homedir() || process.env.HOME || ".";
  const num = (v, fallback) => {
    const n = Number(v);
    return Number.isFinite(n) && n > 0 ? n : fallback;
  };
  return {
    apiBase: (process.env.KALODATA_API_BASE || DEFAULT_API_BASE).replace(/\/+$/, ""),
    stateDir: process.env.KALODATA_STATE_DIR || path.join(home, ".kalopilot"),
    requestTimeoutMs: num(process.env.KALODATA_REQUEST_TIMEOUT_MS, 30_000),
    // Poll pacing. Overridable so tests don't have to wait a real minute.
    firstPollMs: num(process.env.KALODATA_POLL_FIRST_MS, 20_000),
    pollIntervalMs: num(process.env.KALODATA_POLL_INTERVAL_MS, 15_000),
    maxPollIntervalMs: num(process.env.KALODATA_POLL_MAX_MS, 30_000),
  };
}

/** Read fresh every call, so dropping in a token file doesn't need a restart. */
function readToken() {
  const fromEnv = (process.env.KALODATA_TOKEN || "").trim();
  if (fromEnv) return fromEnv;
  try {
    const fromFile = fs.readFileSync(path.join(config().stateDir, "token"), "utf8").trim();
    if (fromFile) return fromFile;
  } catch {
    // fall through to the same "no token" message
  }
  throw new ToolError(TOKEN_HELP);
}

/**
 * Last task_id, shared with the official kalopilot skill's ~/.kalopilot/task_id
 * so the two can be used side by side without losing conversation context.
 */
function rememberTask(taskId) {
  const { stateDir } = config();
  try {
    fs.mkdirSync(stateDir, { recursive: true });
    fs.writeFileSync(path.join(stateDir, "task_id"), taskId);
  } catch {
    // Non-fatal: the task_id is still returned to the caller.
  }
}

function lastTask() {
  try {
    const id = fs.readFileSync(path.join(config().stateDir, "task_id"), "utf8").trim();
    return id || null;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------- API

async function callApi(endpoint, { method = "GET", body, query } = {}) {
  const cfg = config();
  const token = readToken();
  const url = new URL(cfg.apiBase + endpoint);
  for (const [key, value] of Object.entries(query || {})) {
    url.searchParams.set(key, value);
  }

  let response;
  try {
    response = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        ...(body ? { "Content-Type": "application/json" } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(cfg.requestTimeoutMs),
    });
  } catch (err) {
    throw new ToolError(
      `Could not reach KaloPilot at ${url.origin} — ${err?.message || err}. ` +
        "Check the network and KALODATA_API_BASE."
    );
  }

  const raw = await response.text();
  let payload = null;
  if (raw) {
    try {
      payload = JSON.parse(raw);
    } catch {
      throw new ToolError(
        `KaloPilot returned HTTP ${response.status} with a non-JSON body:\n${raw.slice(0, 800)}`
      );
    }
  }

  if (response.status === 401 || response.status === 403) {
    const detail = payload?.message ? ` ${payload.message}` : "";
    throw new ToolError(`KaloData rejected the token (HTTP ${response.status}).${detail}\n\n${TOKEN_HELP}`);
  }
  if (!response.ok) {
    throw new ToolError(
      `KaloPilot returned HTTP ${response.status}: ${payload?.message || raw.slice(0, 500) || "(empty body)"}`
    );
  }
  if (payload && payload.success === false) {
    const code = payload.code ?? "unknown";
    throw new ToolError(
      `KaloPilot rejected the request (code ${code}): ${payload.message || "no message"}` +
        "\nCommon causes: insufficient credits, or the data needs a higher KaloData plan."
    );
  }
  return payload?.data ?? payload ?? {};
}

async function submitQuery(query, taskId) {
  const data = await callApi("/chat/async/submit", {
    method: "POST",
    body: taskId ? { query, task_id: taskId } : { query },
  });
  const newTaskId = data?.task_id;
  if (!newTaskId) {
    throw new ToolError(`Submit succeeded but returned no task_id: ${JSON.stringify(data).slice(0, 500)}`);
  }
  rememberTask(newTaskId);
  return data;
}

function fetchResult(taskId) {
  return callApi("/chat/async/result", { query: { task_id: taskId } });
}

// ---------------------------------------------------------------- polling

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const PENDING = new Set(["running", "submitted", "pending", "queued"]);

/**
 * Poll until the task leaves a pending state or the time budget runs out.
 * Returns the final payload, or null if the budget expired while still running.
 */
async function pollUntilDone(taskId, budgetMs) {
  const cfg = config();
  const deadline = Date.now() + budgetMs;
  let delay = cfg.firstPollMs;

  while (true) {
    const remaining = deadline - Date.now();
    if (remaining <= 0) return null;
    await sleep(Math.min(delay, remaining));

    const data = await fetchResult(taskId);
    if (!PENDING.has(String(data?.status))) return data;

    delay = Math.min(cfg.maxPollIntervalMs, Math.max(cfg.pollIntervalMs, delay));
  }
}

// ---------------------------------------------------------------- rendering

function renderResult(data) {
  const status = String(data?.status ?? "unknown");
  const taskId = data?.task_id ?? "(unknown)";

  if (PENDING.has(status)) {
    return `Status: ${status}. task_id=${taskId}\nStill working — call kalodata_result with this task_id in ~30s.`;
  }
  if (status === "error") {
    return `KaloPilot task failed. task_id=${taskId}\n${data?.error?.message || "no error message returned"}`;
  }
  if (status === "cancelled") {
    return `KaloPilot task was cancelled. task_id=${taskId}`;
  }

  const parts = [`Status: ${status}. task_id=${taskId}`, ""];
  if (data?.text) parts.push(String(data.text));
  if (data?.report) parts.push("", "--- Full report ---", String(data.report));
  // report_url is server-generated and unguessable — pass it through verbatim
  // or not at all.
  if (data?.report_url) parts.push("", `Report link: ${data.report_url}`);
  if (data?.credits_consumed != null) parts.push("", `(consumed ${data.credits_consumed} credits)`);
  parts.push("", `Reuse task_id=${taskId} for follow-up questions on this topic.`);
  return parts.join("\n");
}

// ---------------------------------------------------------------- tools

const TOOLS = [
  {
    name: "kalodata_ask",
    description:
      "Ask KaloPilot a question about TikTok Shop / TikTok e-commerce data and wait for the answer. " +
      "Covers products, shops, creators, videos, livestreams and categories across all TikTok Shop " +
      "regions (US, UK, ID, MY, TH, VN, PH, SG, MX, DE, IT, FR, ES, BR, JP). Ask in any language. " +
      "Simple lookups take ~1 minute; cross-dimensional analysis takes several. If the wait budget " +
      "runs out the tool returns the task_id so you can keep polling with kalodata_result. " +
      "Pass task_id to continue an earlier thread — that is what lets follow-ups like " +
      '"compare it with the UK" resolve. Never answer TikTok market questions from memory; only ' +
      "KaloPilot has current data.",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "The question, in natural language, in any language.",
        },
        task_id: {
          type: "string",
          description:
            "Task id from a previous call, to continue that conversation. Omit when the topic changes.",
        },
        wait_seconds: {
          type: "number",
          description: "How long to wait before giving up and returning the task_id. Default 240, max 900.",
          minimum: 5,
          maximum: 900,
        },
      },
      required: ["query"],
      additionalProperties: false,
    },
  },
  {
    name: "kalodata_query",
    description:
      "Submit a KaloPilot question and return immediately with a task_id, without waiting for the " +
      "answer. Use when you want to start a long analysis and do other work first; poll it later with " +
      "kalodata_result. For the normal case prefer kalodata_ask.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "The question, in natural language." },
        task_id: { type: "string", description: "Previous task id, to continue that conversation." },
      },
      required: ["query"],
      additionalProperties: false,
    },
  },
  {
    name: "kalodata_result",
    description:
      "Fetch the current state of a KaloPilot task: running, completed, error or cancelled. " +
      "Defaults to the most recently submitted task. Poll roughly every 30 seconds while running.",
    inputSchema: {
      type: "object",
      properties: {
        task_id: {
          type: "string",
          description: "Task to poll. Defaults to the last task submitted from this machine.",
        },
      },
      additionalProperties: false,
    },
  },
];

async function runTool(name, args) {
  switch (name) {
    case "kalodata_ask": {
      const query = String(args?.query ?? "").trim();
      if (!query) throw new ToolError("`query` is required and cannot be empty.");
      const budgetSeconds = Math.min(900, Math.max(5, Number(args?.wait_seconds) || 240));

      const submitted = await submitQuery(query, args?.task_id);
      const taskId = submitted.task_id;
      const final = await pollUntilDone(taskId, budgetSeconds * 1000);

      if (!final) {
        return (
          `Still running after ${budgetSeconds}s. task_id=${taskId}\n` +
          "Nothing has failed — complex analyses legitimately take several minutes. " +
          "Call kalodata_result with this task_id to pick it up."
        );
      }
      return renderResult(final);
    }

    case "kalodata_query": {
      const query = String(args?.query ?? "").trim();
      if (!query) throw new ToolError("`query` is required and cannot be empty.");
      const submitted = await submitQuery(query, args?.task_id);
      return (
        `Submitted. task_id=${submitted.task_id} (status: ${submitted.status ?? "submitted"})\n` +
        "Poll kalodata_result with this task_id — first check after ~45s for a simple question, " +
        "~90s for a complex one, then every 30s."
      );
    }

    case "kalodata_result": {
      const taskId = String(args?.task_id ?? "").trim() || lastTask();
      if (!taskId) {
        throw new ToolError("No task_id given and no previous task on record. Run kalodata_query first.");
      }
      return renderResult(await fetchResult(taskId));
    }

    default:
      throw new ToolError(`Unknown tool: ${name}`);
  }
}

// ---------------------------------------------------------------- JSON-RPC

function send(message) {
  process.stdout.write(JSON.stringify(message) + "\n");
}

function sendResult(id, result) {
  send({ jsonrpc: "2.0", id, result });
}

function sendError(id, code, message) {
  send({ jsonrpc: "2.0", id, error: { code, message } });
}

async function handleRequest(request) {
  const { id, method, params } = request;

  switch (method) {
    case "initialize": {
      const asked = params?.protocolVersion;
      return sendResult(id, {
        protocolVersion: SUPPORTED_PROTOCOLS.includes(asked) ? asked : SUPPORTED_PROTOCOLS[0],
        capabilities: { tools: { listChanged: false } },
        serverInfo: SERVER_INFO,
        instructions:
          "Route every TikTok Shop / TikTok e-commerce data question through kalodata_ask. " +
          "Reuse the returned task_id for follow-ups on the same topic. Never invent figures or " +
          "report links — if a call fails, say it failed.",
      });
    }

    case "ping":
      return sendResult(id, {});

    case "tools/list":
      return sendResult(id, { tools: TOOLS });

    case "tools/call": {
      const name = params?.name;
      try {
        const text = await runTool(name, params?.arguments ?? {});
        return sendResult(id, { content: [{ type: "text", text }] });
      } catch (err) {
        // Tool failures belong in the result so the model can read and react to
        // them; only protocol failures become JSON-RPC errors.
        const text = err instanceof ToolError ? err.message : `Unexpected failure: ${err?.stack || err}`;
        return sendResult(id, { content: [{ type: "text", text }], isError: true });
      }
    }

    default:
      return sendError(id, -32601, `Method not found: ${method}`);
  }
}

function handleLine(line) {
  let message;
  try {
    message = JSON.parse(line);
  } catch {
    return sendError(null, -32700, "Parse error: line was not valid JSON");
  }
  // Notifications carry no id and get no response — including
  // notifications/initialized and notifications/cancelled.
  if (message?.id === undefined || message?.id === null) return;

  handleRequest(message).catch((err) => {
    sendError(message.id, -32603, `Internal error: ${err?.message || err}`);
  });
}

function main() {
  let buffer = "";
  process.stdin.setEncoding("utf8");
  process.stdin.on("data", (chunk) => {
    buffer += chunk;
    let newline;
    while ((newline = buffer.indexOf("\n")) >= 0) {
      const line = buffer.slice(0, newline).trim();
      buffer = buffer.slice(newline + 1);
      if (line) handleLine(line);
    }
  });
  process.stdin.on("end", () => process.exit(0));
}

main();
