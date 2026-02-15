# Aman's Claude Code Setup

Everything I use day-to-day with Claude Code — plugins, skills, and settings.

## Install

Paste this into Claude Code:

> Read https://github.com/amanaiproduct/amans-claude-plugins
> and help me install each plugin interactively — show me
> what each one does and let me pick which ones I want.

## Plugins & Skills

### Custom (included in this repo)

- **plugin-dashboard** — ASCII tool/plugin usage dashboard on every turn (badge & box modes)
- **amans-tools** — Personal skills and commands:
  - `/ccusage` — Check Claude Code usage stats
  - `excalidraw-skill` — Draw and refine Excalidraw diagrams via MCP

### Marketplace

- **[compound-engineering](https://github.com/EveryInc/compound-engineering-plugin)** — 29 agents, 22 commands, 19 skills for code review, research, design, and workflow automation
- **[frontend-design](https://github.com/anthropics/claude-plugins-official)** — UI/UX implementation skill
- **[ralph-loop](https://github.com/anthropics/claude-plugins-official)** — Run Claude in a loop until task completion
- **[explanatory-output-style](https://github.com/anthropics/claude-plugins-official)** — Educational insights about implementation choices
- **[plugin-dev](https://github.com/anthropics/claude-plugins-official)** — Tools for building Claude Code plugins

## Manual Install

```bash
# Marketplaces
claude plugin add github:anthropics/claude-plugins-official
claude plugin add git:https://github.com/EveryInc/compound-engineering-plugin.git

# Marketplace plugins
claude plugin enable compound-engineering@every-marketplace
claude plugin enable frontend-design@claude-plugins-official
claude plugin enable ralph-loop@claude-plugins-official
claude plugin enable explanatory-output-style@claude-plugins-official
claude plugin enable plugin-dev@claude-plugins-official

# Custom plugins (clone this repo first)
claude plugin add dir:~/Projects/amans-claude-plugins
claude plugin enable plugin-dashboard@amans-plugins
claude plugin enable amans-tools@amans-plugins
```
