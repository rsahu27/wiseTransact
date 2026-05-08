---
name: Mobile App Multi-Agent Workflows
description: Step-by-step workflows for each of the 5 agents in the mobile app multi-agent system
type: project
originSessionId: fa08fbf5-bde2-4b9d-bc42-2e3a62599d07
---
# Multi-Agent Workflows

## Workflow 1: Super Agent
**Triggers:** User command, automatic milestone monitor, deadline monitor, task completion events

1. Receive user command
2. Interpret task
3. Identify relevant agent
4. Create Jira ticket
5. Assign task to selected agent
6. Create/update Confluence page
7. Monitor progress automatically
8. Wait for status update from agent
9. Evaluate submitted output using LLM
10. Check satisfaction confidence
    - >= 90% → Approve task
    - < 90% → Reject and send back for revision
11. Track bugs
12. Log issues in Jira
13. Update Confluence
14. Check deadlines
15. Notify user

## Workflow 2: UI/UX Design Agent
**Trigger:** Task assigned by Super Agent

1. Receive design task
2. Open Figma via MCP
3. Review requirements
4. Create wireframes
5. Create prototypes
6. Create brand palette
7. Create end-to-end UI design
8. Generate design assets
9. Upload/share Figma links
10. Update Jira
11. Update Confluence
12. Report status to Super Agent

## Workflow 3: Frontend Development Agent
**Trigger:** Task assigned by Super Agent

1. Receive task
2. Open Cursor via Cloudflare MCP
3. Pull Figma designs
4. Create screens
5. Implement navigation
6. Implement arrow navigation
7. Integrate APIs (bound to Cloudflare Workers via Cloudflare MCP)
8. Run smoke tests
9. Run regression tests
10. Log bugs if found → Create bug ticket → Assign back through Super Agent
11. Deploy to Cloudflare Pages via Cloudflare MCP
12. Update Jira
13. Send status update to Super Agent

## Workflow 4: Backend Development Agent
**Trigger:** Task assigned by Super Agent

1. Receive task
2. Open Node.js / Cloudflare Workers project
3. Connect to Cloudflare via Cloudflare MCP (Workers, D1, KV, R2)
4. Build APIs as Cloudflare Workers
5. Configure authentication (Cloudflare Access or Workers-based auth)
6. Create database schema in D1 (Cloudflare MCP)
7. Implement backend logic in Workers
8. Store assets/files in R2 via Cloudflare MCP
9. Deploy via Cloudflare MCP (wrangler deploy)
10. Run backend validation
11. Update Jira through Super Agent
12. Update Confluence through Super Agent
13. Report completion

## Workflow 5: Analytics Agent
**Trigger:** Manual command from user routed via Super Agent

1. Receive analytics request
2. Access Cloudflare Web Analytics via Cloudflare MCP
3. Query data using Cloudflare GraphQL Analytics API (rum, httpRequests, Workers metrics)
4. Pull relevant datasets (pageviews, sessions, performance, error rates)
5. Analyze data
6. Generate reports
7. Identify anomalies/trends
8. Send analytics summary
9. Report back to Super Agent

**Why:** These are the canonical step-by-step workflows for each agent.  
**How to apply:** Reference these when implementing, simulating, or extending any agent's behavior.
