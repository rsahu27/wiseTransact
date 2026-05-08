# WiseTransact Backend

Cloudflare Workers backend for the WiseTransact money transfer application.

## Setup

1. Install dependencies: `npm install`
2. Copy `.dev.vars.example` to `.dev.vars` and fill in values
3. Run locally: `npm run dev`

## Deployment

| Environment | Command | Trigger |
|-------------|---------|---------|
| Dev | `npm run deploy:dev` | Push to `develop` branch |
| Staging | `npm run deploy:staging` | Push to `staging` branch |
| Production | `npm run deploy:prod` | Git tag `v*` (e.g. `v1.0.0`) |

## Database Migrations

```bash
npm run db:migrate:dev       # Apply migrations to dev D1
npm run db:migrate:staging   # Apply migrations to staging D1
npm run db:migrate:prod      # Apply migrations to prod D1
```

## Rollback Procedure

### Workers rollback (code)
Cloudflare retains the previous deployment. To roll back:
```bash
# List recent deployments
wrangler deployments list

# Roll back to a specific deployment ID
wrangler rollback <deployment-id>

# Or roll back to the previous deployment (no ID needed)
wrangler rollback
```
For staging: `wrangler rollback --env staging`
For prod: `wrangler rollback --env prod`

> Rollback takes effect within 30 seconds globally.

### D1 database rollback
D1 does not support automatic migration rollback. To reverse a migration:
1. Write a new migration file (e.g. `0005_rollback_xxx.sql`) with the inverse SQL (`DROP TABLE`, `ALTER TABLE`, etc.)
2. Apply it: `wrangler d1 migrations apply wisetransact-db-prod --env prod`
3. Never delete existing migration files — always add new ones.

### KV / R2 rollback
KV and R2 data changes are not versioned. For data recovery, restore from a backup or manually delete/restore affected keys.

## Environment Variables

See `.dev.vars.example` for all required variables. Production secrets are stored as Cloudflare Workers Secrets — never in source code.
