# Aman's Claude Code Setup

Everything I use with Claude Code. Paste this into a session to get started:

> Read https://github.com/amanaiproduct/amans-claude-plugins and walk me through installing each plugin and skill one by one. Describe what each one does and let me pick.

## How This Works

This is a curated collection of plugins and skills I use daily. Some are from external marketplaces (you register the marketplace, then enable the plugin). Some ship in this repo (you clone it, then enable the plugin or copy the skill). The prompt above has Claude walk you through each one interactively.

## Catalog

### Plugins

#### compound-engineering

- **Source:** External marketplace (`every-marketplace`)
- **What it does:** 29 agents, 22 commands, 19 skills for planning features, running multi-agent code reviews, and compounding workflow knowledge.
- **Prerequisite:** Register the marketplace:
  ```bash
  claude plugin add git:https://github.com/EveryInc/compound-engineering-plugin.git
  ```
- **Install:**
  ```bash
  claude plugin enable compound-engineering@every-marketplace
  ```

#### plugin-dashboard

- **Source:** This repo (`amans-plugins`)
- **What it does:** Shows which tools and plugins were used on every Claude Code turn — compact badge or ASCII box. Includes `/dashboard` for a full system map.
- **Prerequisite:** Clone this repo and register it as a local marketplace:
  ```bash
  git clone --recurse-submodules https://github.com/amanaiproduct/amans-claude-plugins ~/Projects/amans-claude-plugins
  claude plugin add dir:~/Projects/amans-claude-plugins
  ```
  If already cloned without submodules: `git submodule update --init --recursive`
- **Install:**
  ```bash
  claude plugin enable plugin-dashboard@amans-plugins
  ```

#### frontend-design

- **Source:** External marketplace (`claude-plugins-official`)
- **What it does:** Guides Claude to build production-grade UI with proper component architecture, not generic bootstrap.
- **Prerequisite:** Register the marketplace (same marketplace as ralph-loop, explanatory-output-style, and plugin-dev — only needed once):
  ```bash
  claude plugin add github:anthropics/claude-plugins-official
  ```
- **Install:**
  ```bash
  claude plugin enable frontend-design@claude-plugins-official
  ```

#### ralph-loop

- **Source:** External marketplace (`claude-plugins-official`)
- **What it does:** Runs Claude in a loop until a task is fully complete — set a goal, define a completion condition, walk away.
- **Prerequisite:** Same as frontend-design (register `claude-plugins-official` if not already done).
- **Install:**
  ```bash
  claude plugin enable ralph-loop@claude-plugins-official
  ```

#### explanatory-output-style

- **Source:** External marketplace (`claude-plugins-official`)
- **What it does:** Makes Claude explain its implementation choices with educational context.
- **Prerequisite:** Same as frontend-design (register `claude-plugins-official` if not already done).
- **Install:**
  ```bash
  claude plugin enable explanatory-output-style@claude-plugins-official
  ```

#### plugin-dev

- **Source:** External marketplace (`claude-plugins-official`)
- **What it does:** Tools and workflows for building your own Claude Code plugins.
- **Prerequisite:** Same as frontend-design (register `claude-plugins-official` if not already done).
- **Install:**
  ```bash
  claude plugin enable plugin-dev@claude-plugins-official
  ```

### Skills

#### ccusage

- **Source:** This repo
- **What it does:** Check Claude Code token usage and costs via `bunx ccusage`.
- **Prerequisite:** Clone this repo (see plugin-dashboard prerequisite above).
- **Install:**
  ```bash
  cp -r ~/Projects/amans-claude-plugins/skills/ccusage ~/.claude/skills/
  ```

#### excalidraw

- **Source:** This repo
- **What it does:** Draw and refine diagrams on a live Excalidraw canvas via MCP, with iterative visual feedback.
- **Prerequisite:** Clone this repo (see plugin-dashboard prerequisite above).
- **Install:**
  ```bash
  cp -r ~/Projects/amans-claude-plugins/skills/excalidraw ~/.claude/skills/
  ```
