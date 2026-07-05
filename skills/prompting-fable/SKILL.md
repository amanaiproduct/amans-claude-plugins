---
name: prompting-fable
description: >
  How to prompt Fable (and other next-generation frontier agentic models) to get
  outsized results — distilled from Matt Shumer's "How I Prompt Fable." Use when
  handing a big build/creative/engineering task to a top-tier model, when the user
  asks "help me write a prompt for X", mentions Fable, /loop, or ultracode, or says
  "I can't get results like the demos." Shifts prompting from step-by-step
  instructions to goal + house rules + a hard self-checkable bar + looping.
---

# Prompting Fable

Distilled from Matt Shumer's "How I Prompt Fable." The core shift: next-gen models
get WORSE when you spoon-feed steps and BETTER when you hand a goal and fence it
with rules + a hard bar. Prompt Fable like the current models and you get
current-model results. Change the approach and the ceiling lifts.

Source guide (readable by agents): https://simplemarkdowneditor.com/pub/IbaCrTjLJT?key=uQOQ2NPO3TTUSXyYDjyLf

## The 7 moves

### 1. Give it the goal, not the steps
Hand it big, sweeping, underspecified work — the way you'd hand a goal to a
brilliant person you trust. Every step you dictate overrides its judgment with
yours, and yours is usually worse. Don't specify *how*. Specify *what* and *why*.

### 2. Set house rules so you can trust it
An underspecified goal is safe only when fenced by a few rules it can't cross.
House rules = the handful of things that must always be true regardless of path.
- Example rule: "Don't hard-code special cases (no regex for one edge case) —
  describe the behavior in the system prompt and let the model reason."
- For protection: assign a sub-agent one job — check the work against the house
  rules before anything ships.

### 3. Give it a real bar for "done"
Adjectives ("high quality") make it stop at *its* idea of good enough — lower
than yours. Replace adjectives with a concrete, self-checkable test.
- Write the test yourself when you can: "a stranger can't tell our render from
  the real photo."
- When you can't measure it, hand THAT problem to the model — let it invent the
  measuring stick (e.g. it turned a screen recording into a heat map of motion
  and matched against it).
- **Never let the builder grade itself.** The build agent is biased and has a
  trajectory of justifications. Spin up a SEPARATE sub-agent with a fresh context
  window, point it at the real output (actual pixels, actual running app), and
  task it to PROVE the work is *not* passing.

### 4. Loop it until it hits the bar (especially creative work)
Put it on a loop: build → check against the bar → find the biggest gap → close
it → repeat. For hours or days. The model never gets to decide it's finished —
there's always a next gap. It stops when you say so, or when it genuinely can't
find anything to fix. Use `/loop`.
- Progress trick: have it post progress (screenshots, notes) to a live doc so you
  can watch from your phone and inject comments mid-run.

### 5. Let it build on what you've already done
Old work is fuel. Once you have one great artifact, point new work at it:
"here's the code, here's the quality bar, match this and go beyond it."
It can also read TRACES of prior agent sessions — "read the forest traces and
learn what worked" beats re-explaining the approach.

### 6. Get out of its way
Every forced stop costs time. Clear obstacles up front:
- Give a BUDGET instead of per-use permission for paid services.
- Tell it where keys/credentials live.
- In writing: "make your own calls; only come back if truly blocked or it's a
  decision only I can make."
- Exception: for huge, consequential builds, demand a PLAN first and have it ask
  everything it's unsure about up front. Once the plan is settled, it runs
  without stopping.

### 7. Two ways to run it
- **Engineering — run a team.** Several sessions pull tasks from a list/board,
  each triple-checks its own work with sub-agents and opens a PR with evidence.
  One dedicated integrator merges PRs, runs everything, tests like a real user,
  keeps it green. Overlapping features: one watches the other's traces to stay
  compatible.
- **Creative — momentum + detail.** Same loop, same hard bar, but fan out
  sub-agents to perfect individual pieces (one per tree in a forest). Run several
  separate attempts, keep the best, carry what worked into the next round.

## When to spend on ultracode
Rarely. A good loop with an ambitious goal usually gets there without it. It
earns its cost on FOUNDATIONS — a new system you'll build on for months, where a
good base makes everything easier and a bad one makes everything harder forever.
For that, and pretty much only that, pay for ultracode.

## How to actually use this skill
When the user asks for help prompting Fable (or any frontier agentic model),
draft a prompt with this shape:

```
GOAL: <the outcome, underspecified — no step-by-step>
WHY: <context so it can make good judgment calls>
HOUSE RULES:
  - <invariant 1 it must never break>
  - <invariant 2>
DONE = <a concrete, self-checkable test — no adjectives>
GRADING: a fresh separate sub-agent must try to prove this is NOT done,
         checking the real output, before anything ships.
LOOP: keep closing the biggest gap against DONE until it passes or you're told to stop.
AUTONOMY: budget $<X>; keys at <location>; make your own calls; only stop if truly blocked.
BUILD ON: <links to prior artifacts / traces to match and exceed>
```

Then pressure-test the user's draft: does it dictate steps (cut them)? does it
use adjectives instead of a bar (replace them)? does the builder grade itself
(add a fresh-context adversarial checker)? is there a loop and a stop condition?
