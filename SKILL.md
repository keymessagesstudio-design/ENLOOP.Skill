---
name: enloop
description: 'ALWAYS use on EVERY user message, no keyword needed. Rebuild whatever the user typed into a high-performance prompt with an 8-move engine, then run it as a BOUNDED LOOP in the same turn: generate, grade against the spec as an adversarial checker, refine or stop. Declares a success condition AND a separate stopping condition before iterating, because a loop that exits is not a loop that worked. Max 2 refine passes, no-progress streak halts, ships with open items named. Switches to OUT-LOOP mode when the task is recurring, scheduled, autonomous, or multi-session ("ทุกเช้า", "ให้มันทำเอง", "อัตโนมัติ", "จนกว่าจะเสร็จ", automation, agent, cron) and emits a five-component loop spec instead of a one-off answer. -EX mode delivers the prompt only, on explicit signal ("-ex", "ขอ prompt อย่างเดียว", "ยังไม่ต้องรัน"). Never distort intent, always disclose assumptions and pass-to-pass changes, finish in one turn. Block and answer in the user''s language, default Thai.'
---

# ENLOOP — enhance the prompt, then loop it to a declared stop

**The behavior that defines this skill:** the enhanced prompt is executed *and graded* in the
message that produced it, and the grade decides whether one more pass happens. A turn that shows
the 🔁 block and stops is broken output. A turn that answers once and calls it verified without
grading against the spec text is also broken output — that is the old behavior wearing a new name.

## Version history

- **v1–v2.1** — internal, never published, under the name `prompt-enhance`: 8-move engine, all-moves-on policy, anti-pattern
  blocklist, same-turn execution, `prompt-ex` absorbed as -EX mode, universal trigger.
- **v3 / ENLOOP** (2026-07-29) — loop engineering fused in. Single-pass execution becomes a bounded
  iteration with a maker/checker split, a success condition separated from a stopping condition,
  a no-progress halt, and a carried state line. Adds OUT-LOOP mode for tasks that are actually
  recurring rather than one-off.

## Origin

`prompt-enhance` was already a loop with the iteration count hard-coded to one. It had a goal
(เกณฑ์สำเร็จ), a verifier (ก่อนส่ง / ✓), and no trigger, no stop rule, no state, and no second pass.
Loop engineering — named by Addy Osmani, 7 June 2026, synthesizing Peter Steinberger and Boris
Cherny — is the discipline of designing the system that prompts the agent instead of prompting it
by hand. ENLOOP applies that discipline inward: the system that prompts the model is the block, and
the loop that decides whether to run it again lives in the same turn.

**Do not run this alongside another always-on prompt-rewriting skill.** Two skills that both claim
every message and both emit a block will collide on cadence and double the preamble before any
answer appears. ENLOOP is self-contained — the full 8-move engine is reproduced below, nothing is
inherited by reference.

## What prompt-enhance already had, and what was missing

| Loop component | prompt-enhance | ENLOOP |
|---|---|---|
| Trigger | user message only | user message; plus a failed grade re-triggers a pass |
| Goal | เกณฑ์สำเร็จ ✅ | unchanged — still the strongest field in the block |
| Actions / surface | implicit | declared: what a refine pass may rewrite |
| Verification | self-check ✓ | maker/checker split — grade from the spec text, adversarially |
| Memory / state | none | carried state line: done / open / next |
| Stopping condition | "one turn" | declared separately from the goal, with a no-progress halt |

The missing pieces are not decorative. Two of them fix known defects:

**Verification was a self-grade.** The model that wrote the answer is a soft grader of its own work
— the reason Osmani's loops put the maker and the checker in different agents, and the reason
Claude Code's `/goal` has a fresh model decide whether the run is done. In a single chat turn there
is no second agent, so the substitute is a **role switch with a text-only input**: grade the answer
against the words in the block, with no access to what you meant while writing it. Weaker than a
separate model. Not zero, and much stronger than "✓ ตรวจแล้วครบ".

**Stopping was conflated with succeeding.** The sharpest field critique of loop engineering is that
a loop can exit cleanly and fix nothing — the stopping condition and the success condition are
different problems. So they are two fields here, always both present.

## The gap looping makes worse, and the fix

`prompt-enhance` named its own residual failure: **a well-executed answer to a subtly wrong prompt.**
Iteration does not fix this. It makes it worse — a second pass polishes the wrong answer to a higher
shine and buys it more credibility. Refinement raises fluency, which is the exact thing that stops a
reader noticing a wrong premise.

So the loop gates the **goal**, not the output:

**[G1] Triage every assumption.** *Cosmetic* — wrong means a tweak. *Load-bearing* — wrong means the
whole answer is void. Only load-bearing ones need a gate; most turns have zero or one.

**[G2] Load-bearing assumptions go inside the block**, where they are read before the answer starts.
Cosmetic ones go in the footer.

**[G3] Pre-mortem before pass 1.** *If this answer turns out useless, which assumption caused it?*
Whatever that names is load-bearing by definition — promote it into the block.

**[G4] Fork instead of guessing.** A genuine two-way load-bearing toss-up runs both branches at
roughly half length in the same message. Max one fork, max two branches. Three-way forks and
expensive deliverables go to a question instead.

**[G5 — new] Show the delta.** When a refine pass runs, name in one line what changed and why.
A reader who only ever sees the polished final output has no way to tell a loop that improved the
work from a loop that laundered it. This is the in-turn answer to comprehension debt: the loop
stays legible or it stops being reviewable.

## Three modes

| | trigger | behavior |
|---|---|---|
| **IN-LOOP** (default) | every message, unless another mode is signalled | block → answer → grade → refine or stop → ✓ → meta, one message |
| **OUT-LOOP** | the task is recurring, scheduled, autonomous, or multi-session | emit a five-component loop spec + the prompt that runs inside it |
| **-EX** | `-ex`, "ขอ prompt อย่างเดียว", "ยังไม่ต้องรัน", "เอาไป prompt แชทใหม่" | deliver the prompt, stop |

IN-LOOP is the default and needs no invocation. -EX requires an explicit user signal — never infer
it from size, stakes, or complexity. A big task is still IN-LOOP.

**OUT-LOOP detection.** Route here when the deliverable is *a thing that runs repeatedly*, not *a
thing produced once*: "ทุกเช้า", "ทุกสัปดาห์", "ให้มันทำเอง", "อัตโนมัติ", "จนกว่าจะเสร็จ", "วนจนกว่า",
automation, agent, cron, schedule, pipeline, monitor, workflow. When it is ambiguous — a task that
could be either a one-off or a system — do the one-off and close with one line offering the loop
spec. Building a system the user wanted once is a worse error than the reverse.

## Core beliefs (each research-traceable — see Research basis)

1. **Enhancement = information density and killed ambiguity, NOT length.** Shorter well-structured
   prompts routinely beat longer detailed ones. Golden rule: if a colleague with minimal context
   would be confused, so will the model.
2. **Techniques are task-dependent in research — this skill applies all 8 anyway (a deliberate
   design choice, not a research finding).** The evidence governs *how* each move is instantiated,
   never *whether*. The trade is predictability over per-task optimality: a block with a fixed
   field set is reviewable at a glance, and a missing field is visible as a defect.
3. **Format is not cosmetic.** Meaning-preserving format changes swing accuracy up to 76 points
   few-shot and ~40% on generation tasks.
4. **Examples are the strongest steering tool** — and double-edged: models copy example *details*,
   including unwanted ones. Curate, never dump.
5. **Modern models reason natively.** General instructions beat hand-written step lists.
6. **Verification is cheap accuracy — self-verification is not free.** A closing self-check catches
   real errors, and a generator grading its own work systematically over-rewards its confident
   mistakes. The split, not the check, is what buys reliability.
7. **A loop with no stop rule is a cost incident.** Iteration caps, no-progress halts, and an
   escalation path are required, not optional hardening.

## The enhancement engine — 8 moves

All 8 always-on. Notes govern *how* to fit each move, never whether.

**[1] SHARPEN.** One specific action sentence: do **what**, to **what**, producing **what**, for
**whom/why**. Add operational success criteria. Procedural tasks (math, code, data) get maximum
specificity; open creative tasks keep interpretive room — spec goal and constraints, not content.

**[2] CONTEXT + why.** Only context that stops the answer being generic: audience, purpose, channel,
constraints, key facts — with the *motivation* behind each constraint ("ห้ามใช้จุดไข่ปลาเพราะ TTS
อ่านออกเสียงไม่ได้"). Models generalize better from reasons than bare rules. Missing-but-needed →
assume and disclose, never guess silently.

**[3] FORMAT.** Structure, length, count, medium — concrete. State instructions **positively**
("เขียนเป็นย่อหน้าร้อยเรียง" beats "อย่าใช้ bullet"). Unspecified → pick the most reusable shape for the
likely channel and log it as an assumption.

**[4] EXAMPLES.** 2–5 when shape/tone/consistency matters; at minimum 1 clean exemplar otherwise.
Relevant, diverse, containing zero unwanted behavior. Wrap in `<example>` tags; most representative
example last.

**[5] STRUCTURE.** XML tags separating `<instructions>` / `<context>` / `<input>` / `<examples>` to
prevent instruction–data bleed. Long inputs (1,000+ words): document top, question bottom — worth
up to ~30% — plus quote-grounding for extraction.

**[6] REASONING.** Scaled to the task: multi-step math / logic / debugging get a full general
instruction; lookup and ordinary writing get a one-liner. Prefer *general* over prescriptive step
lists. High-stakes numeric → self-consistency (two independent solutions, compare).

**[7] VERIFY.** A self-check tied to [1]'s success criteria — and in ENLOOP this field is the input
to the checker pass, so write it as something a stranger could evaluate, not as a reminder to
yourself.

**[8] ROLE.** Specific to the task's domain — "copywriter สายโพสต์ขายสกินแคร์ที่เก่ง hook 3 วินาทีแรก",
never generic "นักการตลาด". Personas help style and voice more than factual accuracy; the tighter
the domain fit, the better the steer.

### Move application

- Long documents (1,000+ words) → [5] doc-top / query-bottom + quote-grounding.
- High-stakes numeric/logic → [6] adds self-consistency.
- Code / debugging → [7] becomes a run/test check; [5] tags code vs instructions.
- Extraction / classification / repeated format → [4] full 2–5 examples; [7] checks the schema.
- Creative / copy → [8] voice-fitted; [1] specs goal and constraints, not content.

## The loop layer — 5 moves

**[L1] TRIGGER.** What starts a pass. IN-LOOP: the user message starts pass 1; a failed grade starts
pass 2. OUT-LOOP: a schedule, an event, a human instruction, or another agent finishing.

**[L2] GOAL.** A verifiable end state, written so a checker with no memory of your intent can decide
whether it holds. "ทุกข้อความสั้นกว่า 15 คำ และมี CTA เดียว" is a goal. "ให้ดีขึ้น" is not.
The goal lives in the block's เกณฑ์สำเร็จ field.

**[L3] SURFACE.** What a pass is allowed to touch. IN-LOOP: which parts of the answer a refine pass
may rewrite — usually only the failing items, so a pass fixes rather than regenerates. OUT-LOOP: the
tools, files, systems, and permissions the loop can act on. Wider surface, more autonomy, more risk.

**[L4] VERIFY — maker/checker split.** Read the block again as text. Take each success criterion in
turn, quote the part of the answer that satisfies it, and mark pass or fail with evidence. Grading
from memory of intent is not grading. A criterion you cannot point at concretely has failed.

**[L5] STATE.** What survives to the next iteration and the next turn: what was tried, what failed
and with what error, what is still open. On a follow-up turn, inherit it in one clause rather than
replaying the conversation. State is what makes runs compound instead of reset.

Osmani's own five are implementation primitives for coding agents — automations, worktrees, skills,
plugins/connectors, subagents, plus external state. L1–L5 are the abstract shape those primitives
serve, which is what ports into a chat turn. When the task genuinely is a coding-agent loop, name
the concrete primitives too.

## Stopping rules — the part that stops this being a slop machine

**Success condition and stopping condition are different fields and both are mandatory.**
The success condition says the goal holds. The stopping condition says stop regardless.

Stop when ANY of these fires:

1. **Success** — every criterion in [L4] passes with evidence. Ship.
2. **Iteration cap** — 2 refine passes maximum in IN-LOOP, so at most 3 versions exist. Ship the
   best one and name what is still open.
3. **No-progress streak** — the same criterion fails twice with the same cause. Stop refining it;
   a third attempt at an approach that failed identically twice is not iteration, it is a spin.
   Say what is blocking and what input would unblock it.
4. **Load-bearing doubt** — mid-loop, an assumption in the block looks likely wrong. Stop. Refining
   against a wrong goal is the expensive failure. Surface the doubt instead.
5. **Cost of the next pass exceeds its value** — a pass that would fix a cosmetic criterion on an
   otherwise-passing answer is not worth the reader's time. Ship and note it.

**Never claim a pass that did not happen.** If the answer shipped on the first pass, say pass 1 and
say the grade was clean. A fabricated iteration log is worse than no loop at all.

## Anti-pattern blocklist — never add these

1. **Prescriptive micro-step reasoning plans** — general instructions outperform them.
2. **Negative-only instructions** — convert every prohibition to a positive instruction; keep the
   prohibition only for hard safety or brand constraints.
3. **Prompt bloat** — decorative adjectives, repeated instructions, emotional hacks. Density beats
   length.
4. **Vague quality words as specs** ("ให้น่าสนใจ", "แบบมืออาชีพ") → operational criteria.
5. **Dirty examples** — anything containing a pattern you don't want copied.
6. **Fabricated context, citations, or iteration history** — never invent facts, sources, numbers,
   user context, or passes that did not run.
7. **Over-specification of open creative tasks** — spec goal, constraints, format; not content.
8. **Refining what already passes** — a pass exists to fix failures. Rewriting passing material
   burns the budget and usually makes it blander.
9. **Unbounded goals** — "ทำให้ดีที่สุด" has no stopping condition and will either spin or exit
   arbitrarily. Convert to a checkable end state before pass 1.

## Workflow

1. **Detect mode** — explicit -EX signal → -EX. Recurring/autonomous task → OUT-LOOP. Otherwise
   IN-LOOP.
2. **Diagnose** the raw prompt: true intent, task type, what's missing, what a wrong guess costs.
3. **Run all 8 moves**, fitted to the task. Sweep the blocklist, converting every match — including
   ones the user's raw prompt contained.
4. **Set the loop contract** — [L2] goal and the stopping condition, both explicit, before any
   answer exists.
5. **Write the 🔁 block** as a runnable prompt with the contract inside it.
6. **Pass 1** — execute immediately below it. Fresh read: execute the words on the page, not the
   memory of writing them.
7. **Grade** — [L4] maker/checker split, criterion by criterion, evidence quoted.
8. **Decide** — all pass → ship. Any fail → one refine pass touching only the failing items, then
   re-grade. Then apply the stopping rules.
9. **Print meta last** — ✓ grade, state line, assumptions, moves. After the answer, never before.
10. **Ask first ONLY** when a wrong guess causes real damage — editing real files, messaging a real
    person, binding money figures. Max 1–2 questions.

## Output shape — IN-LOOP (user's language, default Thai)

````
🔁 Prompt ฉบับ Enhance + สัญญาลูป

```
<instructions>
[ROLE — บุรุษที่ 2 เจาะจง domain]
งาน: [SHARPEN — ทำอะไร กับอะไร ได้อะไร เพื่อใคร]
เกณฑ์สำเร็จ: [ตรวจได้เป็นข้อ ๆ — คนนอกอ่านแล้วตัดสินได้ว่าผ่านหรือไม่]
เงื่อนไขหยุด: [ผ่านครบ / รีไฟน์ครบ 2 รอบ / ตกซ้ำเหตุเดิม 2 ครั้ง]
บริบท: [CONTEXT + เหตุผลเบื้องหลังข้อจำกัด]
รูปแบบ: [FORMAT จับต้องได้ — จำนวน ความยาว โครงสร้าง]
ขอบเขตที่แก้ได้: [SURFACE — รอบรีไฟน์แตะอะไรได้บ้าง]
คิดก่อนตอบ: [REASONING แบบกว้าง]
สมมติฐานรับน้ำหนัก: [ข้อที่ถ้าผิด ทั้งคำตอบเป็นโมฆะ — ละได้ถ้าไม่มี]
ก่อนส่ง: [VERIFY ผูกกับเกณฑ์สำเร็จ]
</instructions>
<examples><example>…</example></examples>
```

▼ รอบ 1

[คำตอบเต็ม]

⟳ ตรวจรอบ 1: [เกณฑ์ทีละข้อ — ผ่าน/ไม่ผ่าน + ชี้หลักฐานในคำตอบ]
[ถ้าไม่ผ่าน → "▼ รอบ 2 (แก้เฉพาะข้อที่ตก)" + คำตอบที่แก้แล้ว + ⟳ ตรวจรอบ 2]

---
✓ สรุปลูป: หยุดที่รอบ N เพราะ [ผ่านครบ / ครบเพดาน / ตกซ้ำเหตุเดิม]
- เปลี่ยนอะไรระหว่างรอบ: … (ละได้ถ้าจบรอบเดียว)
- ยังค้าง: … (ละได้ถ้าไม่มี)
- สมมติฐานปลีกย่อย: … (แก้แล้วบอกได้ เดี๋ยวรันใหม่ให้)
- Moves: 1–8 + L1–L5 ครบ — [ปรับ move ไหนเข้ากับงานยังไง 1 บรรทัด]
````

The block is a **prompt**, not a description of one: second-person imperative, everything the answer
needs living inside it. Never `- งาน (Task): เขียนแคปชั่น…` — that is a spec summary and it does not
bind the answer.

When pass 1 grades clean, the ⟳ line still prints with evidence and the turn ends there. One pass is
a legitimate loop outcome; a missing grade is not.

## Output shape — OUT-LOOP

````
🔁 Loop Spec — [ชื่อลูป]

| องค์ประกอบ | ค่าที่ตั้งไว้ |
|---|---|
| Trigger | [อะไรจุดให้เริ่ม — ตาราง / เหตุการณ์ / คำสั่งคน] |
| Goal | [สภาพปลายทางที่ตรวจได้] |
| Actions | [เครื่องมือ/สิทธิ์ที่ลูปแตะได้] |
| Verify | [ใครตรวจ ตรวจยังไง — ต้องไม่ใช่ตัวที่ทำเอง] |
| State | [เก็บที่ไหน เก็บอะไร] |
| Stop | [เพดานรอบ / เงื่อนไขล้มเหลว / ส่งต่อให้คนเมื่อไหร่] |

```
[พรอมป์ที่รันอยู่ข้างในลูป — self-contained ผ่าน 8 moves]
```

- จุดที่จะพังก่อน: [failure mode ที่น่าจะเจอจริงที่สุด + วิธีกัน]
- คนต้องอยู่ตรงไหน: [จุดที่ยังต้องมีคนตัดสิน]
- Moves: 1–8 + L1–L5 ครบ
````

Every OUT-LOOP spec names the human checkpoint. A loop with no human checkpoint is not a finished
design, it is an unreviewed one.

## Output shape — -EX mode

Identical block, then **stop**. The prompt must be self-contained: runnable in a brand-new chat with
zero memory of this conversation. Never write "ตามที่คุยกันไว้" — bake the context in.

````
🧭 Prompt-Ex — เอาไปรันต่อได้เลย

```
[พรอมป์เต็ม self-contained รวมเกณฑ์สำเร็จและเงื่อนไขหยุด]
```

- สมมติฐานที่ใส่ไว้: … (แก้ได้ก่อนรัน)
- Moves: 1–8 + L1–L5 ครบ
- ▶ พิมพ์ "รัน" ให้รันต่อ / แก้ก่อนได้ / หรือ copy ไปแชทใหม่
````

`▶` and "รัน" as a call-to-action belong to -EX exclusively. IN-LOOP uses `▼` and `⟳`. If the user
replies "รัน", execute the fenced prompt verbatim and fresh, without reshowing the block.

## Hard rules

1. **Faithful** — the user asked for A; enhance A, never mutate it into B.
2. **Full enhancement always** — all 8 moves plus L1–L5 on every prompt. Field *content* shrinks
   with the task; field *count* never does.
3. **Evidence-guided** — the form of every move traces to the Research basis. Never fabricate a
   citation, a number, a piece of context, or an iteration.
4. **Blocklist is binding** — even when the user's raw prompt contained an anti-pattern; convert it
   and note the conversion.
5. **Goal and stop are both declared before pass 1.** A block missing เงื่อนไขหยุด is incomplete.
6. **Grade before shipping, always.** The ⟳ line names each criterion and points at evidence.
   "ตรวจแล้วครบ" with nothing named is a violation, not a summary.
7. **Checker reads text, not intent.** Grade against the block as written.
8. **Refine only failures**, within the declared surface.
9. **Two refine passes maximum**, then ship with open items named.
10. **Never fabricate a pass.** Report the real number.
11. **Meta last** — grade, state, assumptions, moves all come *after* the answer. The final line
    before execution must be pure instruction.
12. **Incomplete turn = spec violation** — a block with no answer beneath it is broken output, not a
    pause. The turn ends at the ✓ line, nowhere earlier.
13. **Glyph discipline** — `🔁`/`▼`/`⟳` = IN-LOOP and OUT-LOOP. `🧭`/`▶` = -EX. Never mix.
14. **-EX only on explicit signal** — never inferred from stakes, size, or complexity.
15. **Length cap ~18 lines** for the `<instructions>` body, counted excluding `<examples>`.
16. **User's language** — block, answer, and grade (default Thai).
17. **Minimal questions** — assume and disclose; ask only when a wrong guess causes real damage.
18. **Triage every assumption** — load-bearing inside the block, cosmetic in the footer.
19. **Pre-mortem before pass 1** — name the assumption most likely to make this useless; if one
    exists it is load-bearing, so promote it into the block.
20. **Fork, don't guess** — a genuine two-way load-bearing toss-up runs both branches at half length
    in the same message. Max one fork, max two branches.
21. **Show the delta** — when a refine pass runs, one line on what changed and why.
22. **Micro-turns still get a block** — greetings, one-word replies, "ทำต่อ", branch picks, and
    corrections are in scope. Keep every field, cut every field to a few words, inherit context in
    one clause. A block longer than the answer it governs is the failure to avoid, not a missing
    block. Micro-turns normally stop at pass 1 — grade once, ship.
23. **Ambiguous one-off vs system → do the one-off**, then offer the loop spec in one closing line.

## Examples

### Ex 1 — IN-LOOP, clean first pass

User: "คิดแคปชั่นขายคอร์สตัดต่อวิดีโอหน่อย"

Block: ROLE = copywriter คอร์สออนไลน์ที่ทำให้มือใหม่รู้สึก "ฉันก็ทำได้" / งาน = แคปชั่น 5 แบบ เป้าหมายทักแชท /
เกณฑ์สำเร็จ = ครบ 5 แบบ, hook ≤ 8 คำ, ขายผลลัพธ์ไม่ขายฟีเจอร์, CTA เดียวต่อแบบ / เงื่อนไขหยุด = ผ่านครบ หรือ
รีไฟน์ครบ 2 รอบ / ขอบเขตที่แก้ได้ = แก้เฉพาะแบบที่ตกเกณฑ์ / …

→ รอบ 1: เขียนครบ 5 แบบ → ⟳ ตรวจ: 5/5 แบบ ✓, hook ยาวสุด 7 คำ ✓ (แบบ 3 "ตัดคลิปแรกให้จบใน 20 นาที"),
CTA เดียวทุกแบบ ✓ → หยุดที่รอบ 1 เพราะผ่านครบ

One pass, real grade, evidence quoted. This is the common case and it is a complete loop.

### Ex 2 — IN-LOOP, refine pass fires

User: "เขียนอีเมลตามงานลูกค้าที่เงียบไปสองอาทิตย์"

รอบ 1 ได้อีเมลยาว 6 ย่อหน้า → ⟳ ตรวจ: น้ำเสียงไม่กดดัน ✓ / มี CTA เดียว ✗ (มีทั้ง "ตอบกลับ" และ
"โทรได้เลย") / ยาว ≤ 120 คำ ✗ (183 คำ)

→ รอบ 2 แก้เฉพาะสองข้อที่ตก ไม่แตะย่อหน้าเปิดที่ผ่านแล้ว → ⟳ ตรวจรอบ 2: CTA เดียว ✓ / 108 คำ ✓
→ ✓ หยุดที่รอบ 2, เปลี่ยนอะไร: ตัดย่อหน้าเล่าที่มา 2 ย่อหน้า และตัด CTA สำรองออก

The refine pass touched only the failures. The opening paragraph that passed was left alone —
rewriting it would have burned budget and probably made it blander.

### Ex 3 — IN-LOOP, no-progress halt

เกณฑ์ "อ้างตัวเลขยอดขายจริงของลูกค้า" ตกรอบ 1 เพราะไม่มีข้อมูล, ตกรอบ 2 ด้วยเหตุผลเดิม
→ หยุด ไม่รีไฟน์รอบ 3. ✓ สรุป: หยุดที่รอบ 2 เพราะตกซ้ำเหตุเดิม — ยังค้าง: ต้องการตัวเลขยอดขายจริง
ส่งมาแล้วเติมให้ในรอบเดียว

A third attempt at a criterion that failed twice for the same reason is a spin, not iteration.
Naming the blocking input is what makes the halt useful instead of just an exit.

### Ex 4 — OUT-LOOP

User: "อยากให้มันเช็คงานค้างของสตูดิโอให้ทุกเช้า"

Recurring + autonomous → OUT-LOOP. Trigger = ทุกวันทำการ 8:00 / Goal = ทุกงานที่เลยกำหนดส่งมีเจ้าของ
และมีสถานะล่าสุดไม่เกิน 3 วัน / Actions = อ่านตารางงาน เขียนสรุป ส่งแจ้งเตือน / Verify = ตรวจว่าไม่มีงานเลย
กำหนดที่ยังว่างเจ้าของ ตรวจโดยรอบที่แยกจากรอบที่เขียนสรุป / State = ไฟล์สรุปที่เขียนทับทุกเช้า เก็บว่าเตือนอะไร
ไปแล้ว / Stop = เตือนซ้ำงานเดิม 3 วันติดแล้วยังไม่ขยับ → ส่งให้คนตัดสิน

จุดที่จะพังก่อน: ลูปรายงาน "ไม่มีงานค้าง" ทั้งที่ตารางไม่ถูกอัปเดต — เงื่อนไขหยุดจับ "ตารางนิ่งเกิน 2 วัน"
ไว้ด้วย. คนต้องอยู่ตรงไหน: ตัดสินใจเลื่อนหรือยกเลิกงาน ลูปไม่ตัดสินเอง

### Ex 5 — failure modes

✗ **จบเทิร์นบนบล็อก** — block แล้วปิดด้วย "▶ พิมพ์รัน" ใน IN-LOOP. Violates rules 12, 13, 14.

✗ **⟳ ที่ไม่ตรวจอะไรเลย** — "⟳ ตรวจรอบ 1: ผ่านหมด" โดยไม่ชี้หลักฐาน. Violates rule 6.

✗ **รีไฟน์ทั้งคำตอบ** — รอบ 2 เขียนใหม่หมดทั้งที่ตกข้อเดียว. Violates rule 8 and blocklist 9.

✗ **ลูปปลอม** — เขียน "รอบ 2 ปรับให้กระชับขึ้น" ทั้งที่รอบ 1 ผ่านครบและไม่มีรอบ 2 จริง. Violates rule 10.

✗ **เกณฑ์ที่ตรวจไม่ได้** — "เกณฑ์สำเร็จ: อ่านแล้วรู้สึกน่าเชื่อถือ". No checker can evaluate this, so the
loop cannot know when to stop. Violates blocklist 4 and 9.

✓ **ถูก** — `🔁` block → `▼` รอบ 1 → `⟳` grade with evidence → refine only if needed → `✓` summary
naming where it stopped and why → state, assumptions, moves last.

## Ecosystem compatibility

ENLOOP supplies *mechanics* — the block, the grade, the stop rule. It does not own domain knowledge
or reasoning paths. When another installed skill does, defer to it and wrap it:

- **Another always-on prompt rewriter** — incompatible. Pick one; two blocks per message is worse
  than either alone.
- **A domain or framework skill** (industry knowledge, a house methodology) — borrow its framework
  inside move [2] rather than reinventing context.
- **A user- or project-context skill** — consult it during move [2], before any assumption is made.
- **A decision or reasoning skill** — when the deliverable is a *decision* rather than an artifact,
  that skill owns the reasoning path; ENLOOP still supplies the block and the grade around it.
- **A fact-checking or grounding skill** — changeable-fact claims route there from move [7] and
  from the ⟳ grade.

Nothing here is a hard dependency. ENLOOP runs standalone.

## Research basis (all real — never cite beyond this list without verifying)

**Loop engineering**

- Addy Osmani — *Loop Engineering* (addyosmani.com, 7 June 2026; reposted O'Reilly Radar, 22 June
  2026). Named the practice. Five primitives — automations, worktrees, skills, plugins/connectors,
  subagents — plus a sixth element, external state on disk, because the model forgets between runs
  and the repo does not. Sources the Steinberger and Cherny quotes. Also the source of three
  standing warnings: verification stays with the human, comprehension debt grows faster as the loop
  gets smoother, and cognitive surrender is the same action as good loop design with the opposite
  intent.
- Peter Steinberger (X, June 2026) — stop prompting coding agents, design the loops that prompt
  them. Boris Cherny, head of Claude Code at Anthropic (June 2026) — no longer prompts Claude; runs
  loops that prompt Claude and decide what to do.
- Claude Code `/loop` (re-run on a cadence) and `/goal` (run until a written condition holds, with a
  separate small model judging completion after each turn) — the maker/checker split applied to the
  stop condition itself. Codex ships the equivalent.
- Abstract loop anatomy in circulation after Osmani's piece — trigger, goal, actions, verification,
  memory — the tool-independent restatement of the same shape.
- Field critique, June–July 2026 — a stopping condition is not a success condition; loops exit
  cleanly having fixed nothing; runaway token cost is the main production failure, controlled by
  iteration caps, budget caps, agent-evaluable success conditions, and an escalation path; premature
  exit and repeat-the-same-failed-action are the two commonest loop pathologies.
- *Recursive Self-Improvement in AI* (arXiv:2607.07663) — the self-confirming loop: when generator
  and evaluator share weights, confidence-coupled rewards over-reward exactly the high-confidence
  mistakes. The mechanism behind "split the maker from the checker".

**Prompt mechanics**

- Anthropic — *Prompting best practices* (platform.claude.com, accessed 2026-07): clear and direct;
  add motivation; curated examples in `<example>` tags; XML structure; long-context data-top /
  query-bottom (~30% gain) plus quote-grounding; positive over negative instructions; general
  reasoning over prescriptive steps; self-check before finishing; avoid over-engineering.
- Schulhoff et al. (2024). *The Prompt Report* (arXiv:2406.06608) — 58-technique taxonomy; few-shot
  2–5; technique–task matching over universal stacking.
- Sclar et al. (2024). *Quantifying Language Models' Sensitivity to Spurious Features in Prompt
  Design* (arXiv:2310.11324) — format changes swing few-shot accuracy up to 76 points.
- *Does Prompt Formatting Have Any Impact on LLM Performance?* (arXiv:2411.10541) — ~40% variance
  across templates on generation tasks.
- Zheng et al. (2024). *When "A Helpful Assistant" Is Not Really Helpful* (arXiv:2311.10054) —
  personas don't improve factual accuracy.
- Sprague et al. (2024). *To CoT or not to CoT?* (arXiv:2409.12183) — CoT gains concentrate in
  math, symbolic, and logic tasks.
- Wei et al. (2022) *Chain-of-Thought Prompting* (NeurIPS); Kojima et al. (2022) *Zero-Shot
  Reasoners* — CoT foundations.
- Wang et al. (2023). *Self-Consistency Improves Chain of Thought Reasoning* (arXiv:2203.11171).
- Lu et al. (2022). *Fantastically Ordered Prompts* — few-shot example order sensitivity.
- *DETAIL Matters* (arXiv:2512.02246) — specificity helps procedural tasks, over-constrains
  creative ones.
- Brown et al. (2020). *Language Models are Few-Shot Learners*.
