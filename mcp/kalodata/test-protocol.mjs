#!/usr/bin/env node
/**
 * Protocol + behaviour test for the kalodata MCP server.
 *
 * Runs the real server over stdio against a local mock of the KaloPilot API,
 * so the whole path — handshake, tool listing, submit, poll, render, auth
 * failure — is exercised without touching kalodata.com or spending credits.
 *
 *   node mcp/kalodata/test-protocol.mjs
 */

import { spawn } from "node:child_process";
import http from "node:http";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SERVER = path.join(path.dirname(fileURLToPath(import.meta.url)), "server.mjs");

let failures = 0;
function check(label, condition, detail) {
  if (condition) {
    console.log(`  ok   ${label}`);
  } else {
    failures++;
    console.log(`  FAIL ${label}${detail ? `\n       ${detail}` : ""}`);
  }
}

// ------------------------------------------------------------ mock KaloPilot

/** Serves the two async endpoints. The first poll reports running. */
function startMockApi() {
  let polls = 0;
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, "http://127.0.0.1");
    const auth = req.headers.authorization || "";
    const reply = (status, body) => {
      res.writeHead(status, { "Content-Type": "application/json" });
      res.end(JSON.stringify(body));
    };

    if (auth !== "Bearer test-token-123") {
      return reply(401, { success: false, message: "invalid token", code: 401 });
    }
    if (url.pathname.endsWith("/chat/async/submit")) {
      let raw = "";
      req.on("data", (c) => (raw += c));
      req.on("end", () => {
        const body = JSON.parse(raw || "{}");
        mockState.lastSubmit = body;
        reply(200, { success: true, data: { task_id: "task-abc", status: "submitted" } });
      });
      return;
    }
    if (url.pathname.endsWith("/chat/async/result")) {
      mockState.lastPolledId = url.searchParams.get("task_id");
      polls++;
      if (polls === 1) {
        return reply(200, { success: true, data: { task_id: "task-abc", status: "running" } });
      }
      return reply(200, {
        success: true,
        data: {
          task_id: "task-abc",
          status: "completed",
          text: "Top US beauty products this week ...",
          report: "# Report\n\n| product | gmv |\n|---|---|",
          report_url: "https://staging.kalodata.com/report?task_id=task-abc&tool_call_id=xyz",
          credits_consumed: 10,
        },
      });
    }
    reply(404, { success: false, message: "no such endpoint", code: 404 });
  });
  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => resolve(server));
  });
}

const mockState = { lastSubmit: null, lastPolledId: null };

// ------------------------------------------------------------ MCP client

function startServer(env) {
  const child = spawn(process.execPath, [SERVER], {
    stdio: ["pipe", "pipe", "inherit"],
    env: { ...process.env, ...env },
  });

  const waiters = new Map();
  let buffer = "";
  child.stdout.setEncoding("utf8");
  child.stdout.on("data", (chunk) => {
    buffer += chunk;
    let newline;
    while ((newline = buffer.indexOf("\n")) >= 0) {
      const line = buffer.slice(0, newline).trim();
      buffer = buffer.slice(newline + 1);
      if (!line) continue;
      const message = JSON.parse(line);
      const waiter = waiters.get(message.id);
      if (waiter) {
        waiters.delete(message.id);
        waiter(message);
      }
    }
  });

  let nextId = 1;
  return {
    request(method, params) {
      const id = nextId++;
      const done = new Promise((resolve, reject) => {
        waiters.set(id, resolve);
        setTimeout(() => reject(new Error(`timeout waiting for ${method}`)), 15_000).unref();
      });
      child.stdin.write(JSON.stringify({ jsonrpc: "2.0", id, method, params }) + "\n");
      return done;
    },
    notify(method, params) {
      child.stdin.write(JSON.stringify({ jsonrpc: "2.0", method, params }) + "\n");
    },
    stop() {
      child.stdin.end();
      child.kill();
    },
  };
}

const textOf = (response) => response.result?.content?.[0]?.text ?? "";

// ------------------------------------------------------------ the run

const api = await startMockApi();
const apiBase = `http://127.0.0.1:${api.address().port}/api/pilot/skill/ext/v1`;
const stateDir = fs.mkdtempSync(path.join(os.tmpdir(), "kalodata-test-"));

console.log("handshake and discovery");
const mcp = startServer({
  KALODATA_API_BASE: apiBase,
  KALODATA_TOKEN: "test-token-123",
  KALODATA_STATE_DIR: stateDir,
  KALODATA_POLL_FIRST_MS: "50",
  KALODATA_POLL_INTERVAL_MS: "50",
  KALODATA_POLL_MAX_MS: "50",
});

const init = await mcp.request("initialize", {
  protocolVersion: "2025-06-18",
  capabilities: {},
  clientInfo: { name: "test", version: "0" },
});
check("initialize echoes the requested protocol", init.result?.protocolVersion === "2025-06-18", JSON.stringify(init.result));
check("initialize declares tools capability", Boolean(init.result?.capabilities?.tools));
check("initialize names the server", init.result?.serverInfo?.name === "kalodata");

mcp.notify("notifications/initialized");
const pong = await mcp.request("ping", {});
check("ping answers (notification did not desync the stream)", pong.result && !pong.error);

const list = await mcp.request("tools/list", {});
const names = (list.result?.tools ?? []).map((t) => t.name).sort();
check(
  "tools/list exposes the three tools",
  JSON.stringify(names) === JSON.stringify(["kalodata_ask", "kalodata_query", "kalodata_result"]),
  JSON.stringify(names)
);
check(
  "every tool declares an object input schema",
  (list.result?.tools ?? []).every((t) => t.inputSchema?.type === "object")
);

console.log("\nask: submit, poll through running, render");
const ask = await mcp.request("tools/call", {
  name: "kalodata_ask",
  arguments: { query: "US beauty top products?", wait_seconds: 10 },
});
const askText = textOf(ask);
check("ask succeeds", ask.result && !ask.result.isError, askText.slice(0, 200));
check("ask forwards the query verbatim", mockState.lastSubmit?.query === "US beauty top products?");
check("ask polls the returned task_id", mockState.lastPolledId === "task-abc");
check("ask waits past the running poll and reports completed", askText.includes("Status: completed"), askText.slice(0, 200));
check("ask renders the analysis text", askText.includes("Top US beauty products"));
check("ask renders the markdown report", askText.includes("# Report"));
check("ask copies report_url verbatim", askText.includes("tool_call_id=xyz"));
check("ask reports credits", askText.includes("10 credits"));
check("ask surfaces the task_id for follow-ups", askText.includes("task-abc"));
check("task_id persisted to the state dir", fs.readFileSync(path.join(stateDir, "task_id"), "utf8") === "task-abc");

console.log("\nfollow-up and standalone polling");
const followUp = await mcp.request("tools/call", {
  name: "kalodata_query",
  arguments: { query: "compare with the UK", task_id: "task-abc" },
});
check("query threads task_id into the request body", mockState.lastSubmit?.task_id === "task-abc", JSON.stringify(mockState.lastSubmit));
check("query returns without waiting", textOf(followUp).includes("Submitted."));

const polled = await mcp.request("tools/call", { name: "kalodata_result", arguments: {} });
check("result defaults to the last task", textOf(polled).includes("task-abc"), textOf(polled).slice(0, 200));

console.log("\nerror paths");
const unknown = await mcp.request("tools/call", { name: "kalodata_nope", arguments: {} });
check("unknown tool is an isError result, not a crash", unknown.result?.isError === true);

const empty = await mcp.request("tools/call", { name: "kalodata_ask", arguments: { query: "  " } });
check("empty query is rejected before spending a call", empty.result?.isError === true && textOf(empty).includes("required"));

const badMethod = await mcp.request("resources/list", {});
check("unsupported method returns -32601", badMethod.error?.code === -32601, JSON.stringify(badMethod));

mcp.stop();

console.log("\nauth: no token anywhere");
const noTokenDir = fs.mkdtempSync(path.join(os.tmpdir(), "kalodata-empty-"));
const anon = startServer({
  KALODATA_API_BASE: apiBase,
  KALODATA_TOKEN: "",
  KALODATA_STATE_DIR: noTokenDir,
});
await anon.request("initialize", { protocolVersion: "2025-06-18", capabilities: {} });
const missing = await anon.request("tools/call", { name: "kalodata_query", arguments: { query: "hi" } });
check("missing token is an isError result", missing.result?.isError === true);
check("missing token explains how to get one", textOf(missing).includes("kalodata.com/pilot"), textOf(missing).slice(0, 200));
anon.stop();

console.log("\nauth: token rejected by the API");
const badToken = startServer({
  KALODATA_API_BASE: apiBase,
  KALODATA_TOKEN: "wrong",
  KALODATA_STATE_DIR: noTokenDir,
});
await badToken.request("initialize", { protocolVersion: "2025-06-18", capabilities: {} });
const rejected = await badToken.request("tools/call", { name: "kalodata_query", arguments: { query: "hi" } });
check("401 is reported as an auth failure", rejected.result?.isError === true && textOf(rejected).includes("rejected the token"), textOf(rejected).slice(0, 200));
badToken.stop();

api.close();
fs.rmSync(stateDir, { recursive: true, force: true });
fs.rmSync(noTokenDir, { recursive: true, force: true });

console.log(failures === 0 ? "\nAll checks passed." : `\n${failures} check(s) failed.`);
process.exit(failures === 0 ? 0 : 1);
