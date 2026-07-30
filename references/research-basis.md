# Research basis

Every mechanic in ENLOOP traces to something on this list. Hard rule 3 forbids citing anything
beyond it without verifying first.

**Verification status: all sources below were checked against their live pages on 2026-07-31.**
Titles, authors, identifiers, and dates confirmed. Where a source supports a *weaker* claim than
ENLOOP makes from it, that is flagged in the entry rather than smoothed over.

---

## Loop engineering

### Osmani, *Loop Engineering* (June 2026)

- Original: addyosmani.com, 7 June 2026 · Substack edition dated 8 June
- Reposted with permission: [O'Reilly Radar](https://www.oreilly.com/radar/loop-engineering/), 22 June 2026

Named the practice. Osmani's framing is that loop engineering means replacing yourself as the
person who prompts the agent, and designing the system that does it instead — a recursive goal the
agent iterates against until complete. He lists five building blocks (automations, worktrees,
skills, plugins/connectors, subagents) and a sixth element, state kept outside the model on disk,
because the model forgets between runs and the repository does not.

He is notably cautious about his own idea, and ENLOOP inherits three of his warnings directly:
verification stays a human responsibility; comprehension debt accumulates *faster* as the loop gets
smoother; and cognitive surrender is behaviourally identical to good loop design, differing only in
intent. He also flags token cost as a live risk, which is where ENLOOP's iteration cap comes from.

**Attribution note.** Osmani named and systematized the practice; he did not invent it and does not
claim to. ENLOOP is an independent application of the framing to a single chat turn, not an
endorsed implementation.

### Steinberger and Cherny (June 2026)

Peter Steinberger's compressed version — stop prompting coding agents, design the loops that prompt
them — and Boris Cherny (head of Claude Code at Anthropic) describing his own job as writing the
loops that prompt Claude and decide what to do next. Both are quoted in and sourced from Osmani's
essay.

### Claude Code `/loop` and `/goal`

`/loop` re-runs on a cadence. `/goal` runs until a written condition holds, with a separate small
model judging completion after each turn — the maker/checker split applied to the stop condition
itself. Codex ships equivalents. **Verify current behaviour against vendor documentation before
relying on specifics; agent tooling in this space changes on a monthly cadence.**

### Field critique, June–July 2026

The commentary that accumulated after Osmani's piece, across practitioner blogs and social posts.
Three points ENLOOP builds on directly:

1. A stopping condition is not a success condition. Loops exit cleanly having fixed nothing.
2. Runaway token cost is the main production failure. Controlled by iteration caps, budget caps,
   agent-evaluable success conditions, and an escalation path.
3. Premature exit and repeating-the-same-failed-action are the two commonest loop pathologies.

This is a synthesis of distributed commentary rather than a single citable document. Treated as
field observation, not as a finding.

### Chen, Wang & Qu, *Recursive Self-Improvement in AI: From Bounded Self-Refinement to Autonomous Research Loops*

[arXiv:2607.07663](https://arxiv.org/abs/2607.07663) · submitted 8 July 2026 · 42 pages
UC Riverside, AlphaAvatar, Illinois Institute of Technology

A survey of 1,250 arXiv papers from 2024–2026, organized along two axes: what the system improves
(deployment behaviour, policy through training, its own evaluator, or the research process itself)
and how closed the loop is, from human-in-the-loop to fully closed. Its central move is separating
bounded self-refinement — convergent, evaluable, already industrial practice — from open-ended
recursive self-improvement, which the survey finds remains bounded by grounding requirements,
collapse dynamics, and compute constraints on every axis they measured.

**Scope caveat.** ENLOOP cites this paper for a specific mechanism: that when generator and
evaluator share weights, confidence-coupled reward over-rewards exactly the high-confidence
mistakes. That mechanism is consistent with the paper's treatment of evaluator self-improvement and
collapse dynamics, but the abstract does not state it in those words. Read the relevant section of
the body before quoting ENLOOP's phrasing as the paper's. The design decision — split the maker
from the checker — stands on its own regardless.

---

## Prompt mechanics

### Anthropic, *Prompting best practices*

platform.claude.com, accessed July 2026. Source for: be clear and direct; give the model motivation
rather than bare rules; use curated examples in `<example>` tags; structure with XML; for long
context put the document at the top and the question at the bottom (worth roughly 30%) and ground
answers in quotes; prefer positive instructions over prohibitions; prefer general reasoning
instructions over prescriptive step lists; self-check before finishing; avoid over-engineering.

### Schulhoff et al. (2024), *The Prompt Report*

[arXiv:2406.06608](https://arxiv.org/abs/2406.06608). A 58-technique taxonomy. Supports few-shot
counts of 2–5, and the finding that technique-to-task matching beats stacking every technique
universally.

**ENLOOP deliberately departs from this.** It runs all 8 moves on every prompt. That is a
predictability trade, not a claim that the research endorses it — see core belief 2.

### Sclar et al. (2024), *Quantifying Language Models' Sensitivity to Spurious Features in Prompt Design*

[arXiv:2310.11324](https://arxiv.org/abs/2310.11324). Meaning-preserving formatting changes swing
few-shot accuracy by up to 76 points. The reason move [3] treats format as load-bearing rather than
cosmetic.

### *Does Prompt Formatting Have Any Impact on LLM Performance?*

[arXiv:2411.10541](https://arxiv.org/abs/2411.10541). Roughly 40% variance across templates on
generation tasks. Corroborates the above on a different task family.

### Zheng et al. (2024), *When "A Helpful Assistant" Is Not Really Helpful*

[arXiv:2311.10054](https://arxiv.org/abs/2311.10054). Personas in system prompts do not improve
factual accuracy. Why move [8] is scoped to voice and style, and never offered as an accuracy
mechanism.

### Sprague et al. (2024), *To CoT or not to CoT?*

[arXiv:2409.12183](https://arxiv.org/abs/2409.12183). Chain-of-thought gains concentrate in math,
symbolic, and logic tasks. Why move [6] scales reasoning to the task instead of attaching a
thinking instruction to everything.

### Wei et al. (2022), *Chain-of-Thought Prompting* · Kojima et al. (2022), *Zero-Shot Reasoners*

NeurIPS 2022 and [arXiv:2205.11916](https://arxiv.org/abs/2205.11916). CoT foundations.

### Wang et al. (2023), *Self-Consistency Improves Chain of Thought Reasoning*

[arXiv:2203.11171](https://arxiv.org/abs/2203.11171). Source for the high-stakes numeric path in
move [6]: two independent solutions, then compare.

### Lu et al. (2022), *Fantastically Ordered Prompts and Where to Find Them*

[arXiv:2104.08786](https://arxiv.org/abs/2104.08786). Few-shot performance is sensitive to example
order. Why move [4] places the most representative example last.

### Kim (2025), *DETAIL Matters: Measuring the Impact of Prompt Specificity on Reasoning in LLMs*

[arXiv:2512.02246](https://arxiv.org/abs/2512.02246) · submitted 1 December 2025 · Emory University.
Across 30 reasoning tasks on GPT-4 and o3-mini, specificity improves accuracy — the effect is
strongest on smaller models and on procedural tasks. Why move [1] gives procedural work maximum
specificity while leaving creative work interpretive room.

### Brown et al. (2020), *Language Models are Few-Shot Learners*

[arXiv:2005.14165](https://arxiv.org/abs/2005.14165). Foundational.

---

## How to extend this list

If you add a mechanic to ENLOOP, add its source here first, with the identifier and the date you
checked it. If a mechanic has no source, say so in the entry rather than borrowing the nearest
plausible paper — a citation that does not support the claim it is attached to is worse for this
project than an honest gap.
