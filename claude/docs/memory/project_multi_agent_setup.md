---
name: Mobile App Multi-Agent Setup
description: 5-agent Claude CLI architecture for mobile app development (Android + iOS) with Super Agent orchestration
type: project
originSessionId: fa08fbf5-bde2-4b9d-bc42-2e3a62599d07
---
# Mobile App Multi-Agent System

**Architecture:** Super Agent Controlled Workflow  
**Target:** Android + iOS mobile application  
**Source files:** `/Users/rsahu/Documents/Claude Projects/agent_setup_template.txt.rtf` and `workflow_template.txt.rtf`

## Agents

### Agent 1: Super Agent (Orchestrator)
- Oversees end-to-end development from idea to final APK/build
- Receives commands from user, interprets, selects sub-agent, assigns tasks
- Monitors milestones, deadlines, blockers automatically
- Reviews all output — approves only if confidence >= 90%, otherwise rejects and sends back for revision
- Tracks bugs/issues, escalates blockers
- **Tools:** Claude CLI, Jira, Confluence, MCP integrations, LLM evaluator
- **Cannot:** directly code, skip quality review, approve output below 90%

### Agent 2: UI_UX_Design_Agent
- Wireframing, prototyping, brand palette, end-to-end screen design, design handoff
- **Tools:** Figma via MCP
- Reports to Super Agent; cannot approve own work

### Agent 3: Frontend_Development_Agent
- Convert Figma screens to code, screen creation, navigation, arrow navigation, API integration, smoke/regression testing, deploy to Cloudflare Pages
- **Tools:** Cursor App, Cloudflare MCP (Pages deployments, Workers bindings), Claude CLI
- Reports to Super Agent; cannot deploy production or self-approve

### Agent 4: Backend_Development_Agent
- Node.js/Cloudflare Workers backend, D1 database, KV storage, authentication, API creation, wrangler deployments
- **Tools:** Node.js, Cloudflare MCP (Workers, D1, KV, R2, wrangler deploy), Claude CLI
- Updates Jira/Confluence only through Super Agent; cannot modify frontend or self-approve

### Agent 5: Analytics_Agent
- Cloudflare Web Analytics, product metrics, funnel monitoring, user behavior tracking, report generation via Cloudflare GraphQL API
- **Tools:** Cloudflare MCP (Web Analytics, GraphQL analytics API) — read-only
- Read-only analytics access; triggered by Super Agent

## Global Rules
1. All agents only take commands from Super Agent
2. All task assignments require a Jira ticket
3. All major milestones require Confluence updates
4. No task approved below 90% confidence
5. All bugs must be logged in Jira
6. User is final decision authority

**Why:** This is the user's intended project architecture — all future work in this directory should be understood in the context of this 5-agent system.  
**How to apply:** When the user asks to build, assign, or configure any agent behavior, map it to one of the 5 agents above and respect the Super Agent orchestration hierarchy.
