# ENLOOP

**A Claude Skill that rewrites your prompt, runs it, grades the result against its own success criteria, and refines once or twice — all in a single turn.**

[อ่านภาษาไทย →](README.th.md)

---

## Read this before installing

ENLOOP triggers on **every message**. No keyword. That is the design, not a bug.

Every reply you get will open with a `🔁` block — a rewritten version of what you asked — followed by the answer, followed by a graded checklist. If you want a skill that stays quiet until summoned, this is the wrong skill. If you want every answer to arrive with its own spec and its own report card attached, keep reading.

## Why it exists

Most prompt-enhancement tools hand you a better prompt and stop. You then paste it into a new chat, get one answer, and have no way to tell whether the answer actually met the spec you just wrote.

ENLOOP closes that gap. The enhanced prompt is executed *and graded* in the same message that produced it, and the grade decides whether one more pass happens.

The framing comes from **loop engineering**, named by [Addy Osmani](https://addyosmani.com) in June 2026 (also on [O'Reilly Radar](https://www.oreilly.com/radar/loop-engineering/)) — the practice of designing the system that prompts the agent instead of prompting it by hand. ENLOOP applies that inward: the system that prompts the model is the block, and the loop that decides whether to run it again lives in the same turn.

## What a turn looks like

```
🔁 Prompt (enhanced) + loop contract
   ROLE / task / success criteria / stopping condition /
   context / format / editable surface / load-bearing assumptions

▼ Pass 1
   [the actual answer]

⟳ Grade, pass 1
   criterion 1 — pass, evidence: "..."
   criterion 2 — FAIL, only 183 words against a 120-word cap

▼ Pass 2  (fixes only what failed)
   [revised answer]

⟳ Grade, pass 2 — all pass

✓ Stopped at pass 2 because all criteria passed
   What changed: cut two backstory paragraphs, removed the second CTA
   Still open: none
```

## The three things that make it more than a checklist

**1. Success and stopping are separate fields.** A loop can exit cleanly having fixed nothing. So the block declares a success condition ("all criteria pass") *and* a stopping condition ("or 2 refine passes, or the same criterion fails twice for the same reason") — both, always, before pass 1 runs.

**2. The grader reads text, not intent.** A model grading its own work is a soft grader — it over-rewards its own confident mistakes. There is no second agent inside a chat turn, so the substitute is a role switch with a text-only input: grade the answer against the words in the block, with no credit for what you meant while writing it. Weaker than a separate model. Much stronger than "✓ looks good."

**3. It refuses to launder bad work.** Iteration makes a well-executed answer to a *wrong* prompt more dangerous, not less — polish buys a wrong premise more credibility. So the loop gates the goal, not the output: a pre-mortem runs before pass 1, load-bearing assumptions go inside the block where you read them first, and every refine pass names what it changed and why.

## Three modes

| Mode | Triggers on | Behavior |
|---|---|---|
| **IN-LOOP** *(default)* | every message | block → answer → grade → refine or stop, one turn |
| **OUT-LOOP** | recurring, scheduled, or autonomous tasks | emits a five-component loop spec instead of a one-off answer |
| **-EX** | explicit signal only (`-ex`) | delivers the prompt, then stops |

## Install

**Claude.ai / Claude Desktop** — Settings → Capabilities → Skills → upload `SKILL.md`.

**Claude Code** — drop the folder into your skills directory:

```bash
git clone https://github.com/YOUR-USERNAME/enloop.git ~/.claude/skills/enloop
```

**Anthropic API** — load `SKILL.md` as a system prompt or an Agent Skill, depending on your setup.

## Language

ENLOOP answers in the user's language and **defaults to Thai** — the block, the answer, and the grade. To make English the default, change the last clause of the `description` field in the frontmatter and hard rule 16.

## Optional: TikTok Shop data over MCP

`mcp/kalodata/` is a small, dependency-free MCP server that gives Claude live
TikTok Shop data — products, shops, creators, videos, livestreams, categories —
through Kalodata's KaloPilot agent. It is independent of the skill: ENLOOP works
without it, and the server works without ENLOOP. Setup and tools are documented
in [`mcp/kalodata/README.md`](mcp/kalodata/README.md).

## Known trade-offs

Stated up front so you can decide before installing rather than after.

- **Every message costs more.** `SKILL.md` is ~500 lines and loads on every turn, and the block plus the grade add output tokens on top of the answer. On short factual questions this is real overhead for no benefit. Rule 22 keeps the block short on micro-turns, but it does not remove it.
- **It is loud.** The scaffolding is visible by design — a loop you cannot inspect is a loop you cannot trust. Some people find this clarifying and some find it noisy. Try it for a day before deciding.
- **Two refine passes is a cap, not a promise.** When a criterion needs information the model does not have, ENLOOP stops and names what would unblock it rather than inventing a third attempt.
- **The grade is honest, not infallible.** Same-model grading catches specification failures — missing sections, wrong length, absent CTA — far better than it catches subtle factual error. Treat it as a spec check, not a fact check.

## Evidence

Every mechanic traces to something citable. Full list in `references/research-basis.md`; the load-bearing ones:

- Osmani, *Loop Engineering* (June 2026) — the five loop primitives, and the three warnings: verification stays with the human, comprehension debt grows as the loop gets smoother, cognitive surrender looks identical to good loop design.
- Chen, Wang & Qu, *Recursive Self-Improvement in AI* ([arXiv:2607.07663](https://arxiv.org/abs/2607.07663)) — why a generator that grades itself over-rewards its own high-confidence errors.
- Sclar et al., *Quantifying LLMs' Sensitivity to Spurious Features in Prompt Design* ([arXiv:2310.11324](https://arxiv.org/abs/2310.11324)) — meaning-preserving format changes swing few-shot accuracy by up to 76 points.
- Schulhoff et al., *The Prompt Report* ([arXiv:2406.06608](https://arxiv.org/abs/2406.06608)) — the 58-technique taxonomy behind the 8 moves.

## Contributing

The most useful contributions are **failure cases**: a message where the loop fabricated a pass, graded something it could not point at, refined material that had already passed, or produced a block longer than the answer it governed. Open an issue with the input and the output.

## License

MIT — see [LICENSE](LICENSE).

Not affiliated with or endorsed by Anthropic. "Claude" is a trademark of Anthropic, PBC.
