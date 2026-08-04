# Changelog

All notable changes to ENLOOP are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added
- **Kalodata MCP server** (`mcp/kalodata/`) — a zero-dependency stdio MCP server
  wrapping Kalodata's KaloPilot agent, so TikTok Shop data (products, shops,
  creators, videos, livestreams, categories) is reachable as MCP tools:
  `kalodata_ask`, `kalodata_query`, `kalodata_result`. Kalodata ships no MCP
  server of its own; this wraps its async submit/poll HTTP API.
- **`.mcp.json`** at the repo root registering that server for Claude Code.
- **`mcp/kalodata/test-protocol.mjs`** — runs the server over stdio against a
  local mock of the KaloPilot API. Covers the handshake, tool discovery, the
  submit → poll → render path, follow-up threading, and both auth failure
  modes, without network access or credit spend.

The server is optional and independent of the skill — ENLOOP runs without it.

## [3.0.0] — 2026-07-29

First public release.

### Added
- **Loop layer (L1–L5)** — trigger, goal, surface, verify, state. Single-pass
  execution becomes bounded iteration.
- **Maker/checker split** — the grade is a role switch with a text-only input.
  The checker reads the block as written, not the intent behind it.
- **Stopping condition as a separate field from the success condition.** Both
  mandatory, both declared before pass 1.
- **No-progress halt** — the same criterion failing twice for the same cause
  stops the loop and names the blocking input instead of trying a third time.
- **OUT-LOOP mode** — for recurring, scheduled, or autonomous tasks. Emits a
  five-component loop spec plus the prompt that runs inside it. Every spec
  names its human checkpoint.
- **[G5] Show the delta** — a refine pass states what changed and why, so a
  reader can tell a loop that improved the work from one that laundered it.
- **Rule 22** — micro-turns (greetings, one-word replies, branch picks) still
  get a block, with every field cut to a few words.

### Changed
- Verification is no longer a self-check. `✓ looks complete` with nothing named
  is now a spec violation rather than a summary.
- Iteration is capped at 2 refine passes, so at most 3 versions exist.
- Refine passes touch only failing items, within a declared editable surface.

### Notes
- Versions 1 through 2.1 were internal and never published, under the name
  `prompt-enhance`. They had a goal and a verifier but no trigger, no stop rule,
  no state, and no second pass — a loop with the iteration count hard-coded to
  one. The history is kept in `SKILL.md` for context.
