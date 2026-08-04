# Changelog

All notable changes to ENLOOP are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added
- **ENSELL** (`ensell/`) — a sibling skill for affiliate / TikTok Shop selling
  clips. Carries ENLOOP's loop machinery unchanged and adds:
  - a **5-beat sell spine** (สะกิด เห็นของ เชื่อ ค้าน กด) in place of ENSTORY's
    6-slot story spine, because a 25-second clip has no room for ฐาน→ลง;
  - the **cart rule** ([C1] cue never before the demo lands, [C2] two cue points,
    [C3] the reason to act now must be real) — ปักตะกร้า becomes a graded
    timestamp instead of a closing pleasantry;
  - a **claim gate** that blocks อย.-forbidden wording and TikTok Shop's banned
    scarcity / impossible-result claims before a script ships, and converts each
    blocked phrase into something the camera can show;
  - **PICK mode** — scores candidate products on 5 axes before a word is written;
  - **REPAIR mode** for the clip that got views and no orders.
- `ensell/references/` — product-scoring rubric, Thai claim-compliance list with
  sources, and channel/format criteria (clip length ↔ word count, cue timing
  bands, platform file specs and posting caps).

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
