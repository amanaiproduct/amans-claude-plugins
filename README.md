# Aman's Claude Code Setup

My full Claude Code plugin and skill setup. Everything I use day-to-day for AI-assisted development.

## My Custom Plugins

Plugins I built and maintain.

| Plugin | Description |
|--------|-------------|
| [plugin-dashboard](plugins/plugin-dashboard) | ASCII dashboard showing tool/plugin usage per turn (badge & box modes) |
| [amans-tools](plugins/amans-tools) | Personal skills and commands (see below) |

## My Custom Skills & Commands

Bundled in [amans-tools](plugins/amans-tools).

| Type | Name | What it does |
|------|------|-------------|
| Command | `/ccusage` | Runs `bunx ccusage` to check Claude Code usage stats |
| Skill | `excalidraw-skill` | Programmatic Excalidraw canvas via MCP — draw, refine, and export diagrams |

## Marketplace Plugins I Use

Plugins I install from public marketplaces.

| Plugin | Marketplace | Description |
|--------|-------------|-------------|
| [compound-engineering](https://github.com/EveryInc/compound-engineering-plugin) | every-marketplace | 29 agents, 22 commands, 19 skills for code review, research, design, and workflow automation |
| [frontend-design](https://github.com/anthropics/claude-plugins-official/tree/main/plugins/frontend-design) | claude-plugins-official | Frontend design skill for UI/UX implementation |
| [ralph-loop](https://github.com/anthropics/claude-plugins-official/tree/main/plugins/ralph-loop) | claude-plugins-official | Continuous self-referential loops for iterative development (Ralph Wiggum technique) |
| [explanatory-output-style](https://github.com/anthropics/claude-plugins-official/tree/main/plugins/explanatory-output-style) | claude-plugins-official | Adds educational insights about implementation choices and codebase patterns |
| [plugin-dev](https://github.com/anthropics/claude-plugins-official/tree/main/plugins/plugin-dev) | claude-plugins-official | Skills and agents for building Claude Code plugins |

## Settings

```jsonc
// ~/.claude/settings.json
{
  "permissions": {
    "defaultMode": "bypassPermissions"
  },
  "alwaysThinkingEnabled": true
}
```

## Replicate My Setup

```bash
# 1. Add marketplaces
claude plugin add github:anthropics/claude-plugins-official
claude plugin add git:https://github.com/EveryInc/compound-engineering-plugin.git

# 2. Install marketplace plugins
claude plugin enable frontend-design@claude-plugins-official
claude plugin enable ralph-loop@claude-plugins-official
claude plugin enable explanatory-output-style@claude-plugins-official
claude plugin enable compound-engineering@every-marketplace
claude plugin enable plugin-dev@claude-plugins-official

# 3. Install my custom plugins
claude plugin add dir:~/Projects/amans-claude-plugins
claude plugin enable plugin-dashboard@local-plugins
claude plugin enable amans-tools@local-plugins
```
