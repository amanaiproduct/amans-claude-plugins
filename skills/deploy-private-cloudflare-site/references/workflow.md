# Current architecture and documentation map

Use this reference to choose the boundary. Re-open the official pages before a live change; the links below were reviewed on 2026-08-30.

## Preferred: Cloudflare Access

Cloudflare Access checks every request before the Worker runs. Current Workers documentation supports protection attached to one Worker, all Workers, or a hostname/path. Worker-level protection follows the Worker across its routes, custom domains, `workers.dev`, and previews.

Official sources:

- [Cloudflare Access for Workers](https://developers.cloudflare.com/workers/configuration/cloudflare-access/)
- [Access policies and exact Emails selector](https://developers.cloudflare.com/cloudflare-one/access-controls/policies/)
- [workers.dev exposure and Access](https://developers.cloudflare.com/workers/configuration/routing/workers-dev/)
- [Cloudflare Access identity providers](https://developers.cloudflare.com/cloudflare-one/identity/idp-integration/)

Exact-user policy shape:

- Action: Allow
- Rule type: Include
- Selector: Emails
- Values: complete allowlisted email addresses

Access is deny-by-default when a visitor matches no Allow policy. Avoid an `Everyone` Include rule. An Allow policy using only `Login Methods: One-time PIN` allows all valid-email users and is not an exact-person allowlist.

Use Worker-level Access unless WebSockets or path-specific requirements dictate hostname Access. Confirm Zero Trust is enabled and inspect any account/plan prompt before accepting billing or overage terms.

## Fallback: application-managed Google OAuth

This is a separate security architecture, not a small configuration option. It requires:

1. Google Auth Platform branding, audience, and OAuth client.
2. An External audience in Testing with every intended Google account listed as a test user, or an appropriately published/verified app.
3. A Web application client with the callback URI matching exactly, including scheme, case, path, and trailing slash.
4. Server-side code exchange and validation.
5. A second exact-email allowlist in the application.
6. Signed, secure session cookies.
7. A public sign-in/callback surface with no private content.

Official sources:

- [Google OAuth 2.0 for Web Server Applications](https://developers.google.com/identity/protocols/oauth2/web-server)
- [Get started with Google Auth Platform](https://support.google.com/cloud/answer/15544987)
- [Manage OAuth app audience and test users](https://support.google.com/cloud/answer/15549945)
- [Verify Google ID tokens server-side](https://developers.google.com/identity/gsi/web/guides/verify-google-id-token)
- [Google OpenID Connect reference](https://developers.google.com/identity/openid-connect/reference)

Testing-mode authorization for a test user currently expires after seven days. Re-check current Google policy before relying on it for a durable personal site.

Google says a Gmail address is authoritative. For Workspace, require `email_verified` plus `hd`. A Google account using a non-Gmail address without `hd` does not provide continuing authority over the third-party mailbox; use the mailbox's actual identity provider or an email ownership challenge when that matters.

## Cloudflare tools

Use all three layers when available:

- Cloudflare skills for platform patterns and current-doc routing.
- Cloudflare API MCP for account configuration such as Zero Trust policies. It uses OAuth and supports the Cloudflare API.
- Wrangler for local development, builds, secrets, deployment, and real-time tailing.

Official sources:

- [Codex + Cloudflare setup](https://developers.cloudflare.com/agent-setup/codex/)
- [Cloudflare MCP servers](https://developers.cloudflare.com/agents/model-context-protocol/cloudflare/servers-for-cloudflare/)
- [Wrangler commands and OAuth](https://developers.cloudflare.com/workers/wrangler/commands/general/)
- [Cloudflare's agent skills repository](https://github.com/cloudflare/skills)

Wrangler 4.94.0 added automatic Cloudflare skill installation for detected coding agents. Older local versions do not provide that prompt. Regardless of version, retrieve current docs rather than relying on model memory.

In headless environments, use documented Wrangler device/browser-free OAuth. Do not turn a normal browser login into a request for the user's password, session cookies, or an improvised API token.

## Static assets and secrets

Official sources:

- [Run Worker before static assets](https://developers.cloudflare.com/workers/static-assets/routing/worker-script/)
- [Wrangler configuration](https://developers.cloudflare.com/workers/wrangler/configuration/)
- [Workers secrets](https://developers.cloudflare.com/workers/configuration/secrets/)

When application code gates requests, set `run_worker_first: true`, authenticate, and call `env.ASSETS.fetch(request)` for real assets. Framework adapters may generate a deployment configuration, so inspect the emitted config rather than assuming the source `wrangler.jsonc` is the deployed truth.

Use `secrets.required` for names only. Store deployed values with Wrangler secrets. A `wrangler secret put` operation creates and deploys a new Worker version; account for that when sequencing a private launch.

## Privacy-oriented deployment sequence

1. Inventory public routes and known real assets.
2. Build and test locally.
3. Disable `workers.dev` or deploy a fail-closed boundary.
4. Configure Access, or configure Google OAuth and its secrets.
5. Deploy the protected Worker.
6. Enable the intended route.
7. Run anonymous boundary verification.
8. Complete an authenticated browser flow.
9. Test rejected identity, sign-out, mobile layout, and every alternate hostname.
10. Remove local credential downloads and report what was removed and whether it is recoverable.
