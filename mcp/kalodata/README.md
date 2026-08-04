# Kalodata MCP server

An MCP server that puts TikTok Shop data — products, shops, creators, videos,
livestreams, categories — behind three tools any MCP client can call.

Kalodata does not publish an MCP server. What it publishes is **KaloPilot**, an
analytics agent reachable over an async HTTP API: you submit a question, it
returns a `task_id`, and you poll until the analysis finishes. This server is a
thin, dependency-free wrapper around that API.

Requires **Node 18+** (global `fetch`). No `npm install` — there are no
dependencies.

---

## Setup

**1. Get a token.**

1. Log in at [kalodata.com/pilot](https://kalodata.com/pilot).
2. Bottom-left of the sidebar, click **Connect OpenClaw**.
3. Copy the string under **Current Account Token** — a long hex string.

**2. Give the server the token**, either way:

```bash
# Option A — a file (shared with the official kalopilot skill)
mkdir -p ~/.kalopilot && printf %s '<token>' > ~/.kalopilot/token && chmod 600 ~/.kalopilot/token

# Option B — an environment variable, read by .mcp.json
export KALODATA_TOKEN='<token>'
```

The token is read fresh on every call, so you can drop the file in without
restarting the server.

**3. Start Claude Code from the repo root.** The `.mcp.json` at the root
registers the server; approve it when prompted, then check with `/mcp`.

To use it from another project, point at the file absolutely:

```json
{
  "mcpServers": {
    "kalodata": {
      "command": "node",
      "args": ["/absolute/path/to/ENLOOP.Skill/mcp/kalodata/server.mjs"]
    }
  }
}
```

---

## Tools

| Tool | What it does |
|---|---|
| `kalodata_ask` | Ask a question and wait for the answer. The one you normally want. |
| `kalodata_query` | Submit and return immediately with a `task_id`. |
| `kalodata_result` | Poll a task; defaults to the most recent one. |

`kalodata_ask` submits, then polls on a backoff until the task completes or the
wait budget runs out (`wait_seconds`, default 240, max 900). Running out is not
a failure — it returns the `task_id` so you can pick the task up with
`kalodata_result`. Simple lookups land in about a minute; cross-dimensional
analysis with a full report can take several.

**Follow-ups need the `task_id`.** Pass the one you got back and KaloPilot keeps
the conversation context, so `"compare it with the UK"` resolves against what it
already showed you. Drop it when the topic changes.

Ask in any language — KaloPilot handles multilingual queries. Regions covered:
US, UK, ID, MY, TH, VN, PH, SG, MX, DE, IT, FR, ES, BR, JP.

```
kalodata_ask  { "query": "US Beauty, top products by revenue last 7 days" }
  → Status: completed. task_id=abc123
    ... analysis ...
    Report link: https://...
    (consumed 10 credits)

kalodata_ask  { "query": "who are the top 3 creators for #1?", "task_id": "abc123" }
```

Queries consume credits from your KaloData account.

---

## Configuration

| Variable | Default | Purpose |
|---|---|---|
| `KALODATA_TOKEN` | — | Token. Falls back to `~/.kalopilot/token`. |
| `KALODATA_API_BASE` | `https://staging.kalodata.com/api/pilot/skill/ext/v1` | API root. |
| `KALODATA_STATE_DIR` | `~/.kalopilot` | Where the token and last `task_id` live. |
| `KALODATA_REQUEST_TIMEOUT_MS` | `30000` | Per-HTTP-request timeout. Submit and poll are both short. |
| `KALODATA_POLL_FIRST_MS` | `20000` | Delay before the first poll. |
| `KALODATA_POLL_INTERVAL_MS` | `15000` | Delay between later polls. |
| `KALODATA_POLL_MAX_MS` | `30000` | Ceiling on the poll interval. |

`KALODATA_API_BASE` defaults to the `staging.` host because that is the endpoint
KaloPilot's own published skill uses. Change it if Kalodata moves it.

---

## Tests

```bash
node mcp/kalodata/test-protocol.mjs
```

Runs the real server over stdio against a local mock of the KaloPilot API:
handshake, tool discovery, submit → poll-through-running → render, follow-up
threading, and both auth failure paths. No network, no credits.

---

## Design notes

- **Tool failures come back as `isError` results, not JSON-RPC errors**, so the
  model reads the message and reacts — "top up your credits", "the token is
  stale" — instead of the client swallowing a protocol fault.
- **`report_url` is copied verbatim or omitted.** It carries server-generated
  `task_id` and `tool_call_id` values that cannot be inferred, so a constructed
  link is always a broken one.
- **The last `task_id` is stored at `~/.kalopilot/task_id`**, the same place the
  official kalopilot skill keeps it, so the two can be used side by side.
- **Requests are handled concurrently.** A `kalodata_ask` that polls for four
  minutes does not block pings or other calls on the same connection.
