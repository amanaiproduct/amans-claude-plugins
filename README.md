# Aman's Claude Code Setup

> **Paste this into Claude Code to get started:**
>
> ```
> Read https://github.com/amanaiproduct/amans-claude-plugins
> and walk me through installing each plugin and skill one by one.
> Describe what each one does and let me pick.
> ```

This is a curated collection of the plugins and skills I use every day with Claude Code. Some come from external marketplaces, some ship right here in this repo. The prompt above has Claude read this page, present each item, and install whatever you pick.

<p align="center"><img src="assets/setup-map.png" alt="Setup overview" width="720" /></p>

---

## What's Inside

| # | Name | Type | Source | One-liner |
|---|------|------|--------|-----------|
| 1 | **compound-engineering** | Plugin | External | Plan, build, review, compound — full engineering workflow |
| 2 | **ralph-loop** | Plugin | External | Fire-and-forget autonomous loops |
| 3 | **plugin-dashboard** | Plugin | This repo | See what tools Claude used on every turn |
| 4 | **frontend-design** | Plugin | External | Production-grade UI, not generic bootstrap |
| 5 | **explanatory-output-style** | Plugin | External | Claude explains *why*, not just *what* |
| 6 | **plugin-dev** | Plugin | External | Build your own Claude Code plugins |
| 7 | **ccusage** | Skill | This repo | Token usage and cost tracking |
| 8 | **excalidraw** | Skill | This repo | Draw diagrams on a live canvas from Claude |

---

## Plugins

### compound-engineering

> *29 agents, 22 commands, 19 skills for planning features, running multi-agent code reviews, and compounding workflow knowledge.*

**Source:** External marketplace — [EveryInc/compound-engineering-plugin](https://github.com/EveryInc/compound-engineering-plugin)

**How to use it:**

```bash
/workflows:plan        # Turn a feature idea into a structured implementation plan
/workflows:work        # Execute the plan with task tracking
/workflows:review      # Multi-agent code review before you merge
/workflows:compound    # Document what you learned so the next task is easier
```

The philosophy: each unit of engineering work should make the next one easier. Plans inform future plans. Reviews catch patterns. Knowledge compounds.

**Install:**

```bash
claude plugin add git:https://github.com/EveryInc/compound-engineering-plugin.git
claude plugin enable compound-engineering@every-marketplace
```

---

### ralph-loop

> *Set a goal, define a completion condition, walk away. Claude keeps working until it's done.*

**Source:** External marketplace — [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official)

**How to use it:**

```bash
/ralph-loop "Build a REST API for todos with CRUD, validation, and tests"
```

Claude iterates autonomously until your success criteria are met. Great for greenfield projects, overnight builds, or any task with clear pass/fail conditions.

**Install:**

```bash
# Register Anthropic's official marketplace (one time — covers ralph-loop,
# frontend-design, explanatory-output-style, and plugin-dev)
claude plugin add github:anthropics/claude-plugins-official

claude plugin enable ralph-loop@claude-plugins-official
```

---

### plugin-dashboard

> *See exactly which tools and plugins Claude used on every single turn.*

**Source:** This repo

**How to use it:**

After every Claude response you'll see a compact badge:

```
╶─ MCP:manager-ai · File:Read,Grep · Agent:Explore ─╴
```

Toggle to box mode for more detail, or run `/dashboard` for a full system map:

```
┌─ Claude Code System Map ─────────────────────────────┐
│  Dashboard mode: box                                  │
├─ MCP Servers ─────────────────────────────────────────┤
│  ● manager-ai  (npx)                                 │
│  ● granola  (npx)                                    │
├─ Plugins ─────────────────────────────────────────────┤
│  ◆ plugin-dashboard                                   │
│  ◆ compound-engineering                               │
├─ Active Hook Events ──────────────────────────────────┤
│  ⚡ SessionStart                                      │
└───────────────────────────────────────────────────────┘
```

Commands: `/dashboard-toggle` (cycle badge → box → off) · `/dashboard` (full system map)

**Install:**

```bash
git clone --recurse-submodules https://github.com/amanaiproduct/amans-claude-plugins ~/Projects/amans-claude-plugins
claude plugin add dir:~/Projects/amans-claude-plugins
claude plugin enable plugin-dashboard@amans-plugins
```

---

### frontend-design

> *Guides Claude to build distinctive, production-grade UI — proper component architecture, not cookie-cutter bootstrap.*

**Source:** External marketplace — [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official)

**How to use it:**

```bash
/frontend-design      # Invoke when building any web UI
```

Claude will use real design principles — typography scales, color systems, spacing grids, component hierarchy — instead of slapping together generic templates.

**Install:**

```bash
# Requires Anthropic's official marketplace (see ralph-loop above)
claude plugin enable frontend-design@claude-plugins-official
```

---

### explanatory-output-style

> *Makes Claude explain its implementation choices with educational context — learn while you build.*

**Source:** External marketplace — [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official)

**How to use it:**

Once enabled, Claude automatically adds short explanations for *why* it chose a particular approach — not just what it did. Useful when you're learning a new codebase or technology.

**Install:**

```bash
# Requires Anthropic's official marketplace (see ralph-loop above)
claude plugin enable explanatory-output-style@claude-plugins-official
```

---

### plugin-dev

> *Tools and workflows for building your own Claude Code plugins.*

**Source:** External marketplace — [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official)

**How to use it:**

```bash
/create-plugin        # Guided end-to-end plugin creation
```

Walks you through scaffolding a plugin with commands, hooks, agents, skills, and MCP servers. Includes validation and best-practice checks.

**Install:**

```bash
# Requires Anthropic's official marketplace (see ralph-loop above)
claude plugin enable plugin-dev@claude-plugins-official
```

---

## Skills

### ccusage

> *Check your Claude Code token usage and costs.*

**Source:** This repo — [`skills/ccusage`](skills/ccusage)

**How to use it:**

```
/ccusage
```

Runs [`bunx ccusage`](https://github.com/ryoppippi/ccusage) under the hood and displays a breakdown of tokens, costs, and session stats. Essential if you're on a Pro/Max plan and want to see where your tokens go.

**Install:**

```bash
# Requires this repo cloned (see plugin-dashboard above)
cp -r ~/Projects/amans-claude-plugins/skills/ccusage ~/.claude/skills/
```

---

### excalidraw

> *Draw and refine diagrams on a live Excalidraw canvas directly from Claude, with iterative visual feedback.*

**Source:** This repo — [`skills/excalidraw`](skills/excalidraw)

**How to use it:**

Ask Claude to draw any diagram — architecture maps, flowcharts, ERDs, sequence diagrams. Claude creates elements on a live canvas, takes screenshots to verify its own work, and iterates until the diagram looks right.

```
Draw an architecture diagram of my microservices setup
```

Requires the [mcp_excalidraw](https://github.com/yctimlin/mcp_excalidraw) canvas server running locally.

**Install:**

```bash
# Requires this repo cloned (see plugin-dashboard above)
cp -r ~/Projects/amans-claude-plugins/skills/excalidraw ~/.claude/skills/
```

---

## Quick Install (All at Once)

If you want everything, run these in order:

```bash
# 1. Clone this repo
git clone --recurse-submodules https://github.com/amanaiproduct/amans-claude-plugins ~/Projects/amans-claude-plugins

# 2. Register marketplaces
claude plugin add github:anthropics/claude-plugins-official
claude plugin add git:https://github.com/EveryInc/compound-engineering-plugin.git
claude plugin add dir:~/Projects/amans-claude-plugins

# 3. Enable plugins
claude plugin enable compound-engineering@every-marketplace
claude plugin enable ralph-loop@claude-plugins-official
claude plugin enable frontend-design@claude-plugins-official
claude plugin enable explanatory-output-style@claude-plugins-official
claude plugin enable plugin-dev@claude-plugins-official
claude plugin enable plugin-dashboard@amans-plugins

# 4. Install skills
cp -r ~/Projects/amans-claude-plugins/skills/ccusage ~/.claude/skills/
cp -r ~/Projects/amans-claude-plugins/skills/excalidraw ~/.claude/skills/
```
