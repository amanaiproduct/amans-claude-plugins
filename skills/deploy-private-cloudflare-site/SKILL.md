---
name: deploy-private-cloudflare-site
description: Deploy, protect, debug, and verify a private Cloudflare Workers site for an exact user or email allowlist. Use for Workers or framework sites that must require Cloudflare Access, Google OAuth, or another SSO boundary; when protecting Workers Static Assets and framework chunks; when Wrangler/headless OAuth, secrets, workers.dev routes, errors 1042/1101, or unhydrated pages cause trouble; and when proving that anonymous users cannot retrieve sensitive HTML or assets.
---

# Deploy Private Cloudflare Site

Deploy a site behind a fail-closed identity boundary, preserve framework asset delivery after authentication, and verify the public surface before handing it off.

## Non-negotiable rules

- Treat private content, source data, build artifacts, and identity-provider credentials as sensitive.
- Prefer Cloudflare Access attached to the Worker. Use application-managed Google OAuth only when Access is unavailable, unsuitable, or explicitly requested.
- Keep the production route disabled or return a fail-closed maintenance response until the identity boundary and required secrets exist.
- Never place client secrets, signing keys, or API tokens in `vars`, source files, command-line arguments, logs, or chat output. Use `wrangler secret put` through interactive or file-based input.
- Do not fabricate API tokens or ask for account passwords. Use Wrangler OAuth, the Cloudflare API MCP OAuth flow, or a narrowly scoped token the user creates.
- Require explicit authorization before transferring an identity-provider secret from one service to Cloudflare.
- Do not declare success from a local build alone. Test the deployed anonymous boundary and one authenticated browser session.
- Retrieve current official Cloudflare and identity-provider documentation before changing live configuration. Cloudflare's Workers and Access surfaces evolve quickly.

## Load the focused references

- Read [references/workflow.md](references/workflow.md) before choosing the protection architecture or changing live resources.
- Read [references/troubleshooting.md](references/troubleshooting.md) when deployment succeeds but requests fail, assets 404, or the page does not hydrate.
- Run `scripts/verify-private-boundary.mjs` before handoff.

## Workflow

### 1. Inspect before mutating

1. Find repository instructions and inspect the working tree without overwriting unrelated changes.
2. Identify the framework, build command, build output, Wrangler version, existing `wrangler.jsonc` or generated config, routes, asset binding, and current public URLs.
3. Check Cloudflare identity non-destructively with `wrangler whoami`. If unavailable, use `wrangler login`; use `--browser=false` or device flow in a headless environment.
4. Check whether the Cloudflare plugin or Cloudflare API MCP is installed. Use it when available for account configuration, but keep Wrangler for build/deploy/tail operations.
5. Enumerate every public path: production hostname, `workers.dev`, preview URLs, custom domains, static chunks, API endpoints, source maps, and old hosts.
6. Record the intended allowlist and whether each identity is a Gmail, Workspace, or non-Google address. Do not assume a private-relay address can securely authenticate through Google.

### 2. Choose one protection architecture

Use this order:

1. **Worker-level Cloudflare Access**: preferred because every domain and preview attached to the Worker can be protected together.
2. **Hostname/path Access**: use when only a specific route or custom hostname should be private, or when WebSockets make Worker-level Access unsuitable.
3. **Application-managed OAuth**: use only after documenting why Access is not being used. This adds callback, CSRF, token-validation, session, and asset-gating responsibilities to the application.

For exact people in Access, create an Allow policy whose Include selector is `Emails` with the complete addresses. Do not use `Everyone`, `Login Methods: One-time PIN`, or a broad email-domain rule when the requirement is an exact allowlist.

For a non-Google address, Cloudflare Access with email one-time PIN can authenticate ownership without pretending Google is authoritative for that address. If stronger assurance is required, configure its actual identity provider.

### 3. Build a fail-closed Worker boundary

For Cloudflare Access:

- Attach Access to the Worker or exact hostname before enabling the public route.
- Use `ctx.access` only when application code needs the authenticated identity; Access itself should reject unauthorized requests before the Worker runs.
- Confirm the policy is deny-by-default and includes only intended addresses.

For application-managed Google OAuth:

- Use the authorization-code flow with an exact HTTPS redirect URI.
- Generate and verify `state`; use `nonce` and PKCE where supported.
- Exchange the code server-side. Validate the ID token signature, `iss`, `aud`, `exp`, nonce, and verified identity claims against current Google guidance.
- Normalize the email for allowlist comparison, but use the Google `sub` claim as the stable account identifier in stored user records.
- For Gmail, Google is authoritative for the address. For Workspace, require `email_verified` and the expected `hd` claim. For non-Gmail addresses without `hd`, flag that Google does not provide continuing authority over the underlying mailbox.
- Sign the application session with a dedicated random secret. Set cookies `Secure`, `HttpOnly`, and `SameSite=Lax` or stricter; set explicit expiry; rotate deliberately.
- Return a generic 403 for a valid Google account not on the application allowlist.

### 4. Gate HTML and assets together

When Workers Static Assets are present:

- Configure an `ASSETS` binding and `assets.run_worker_first: true` when application code performs authentication.
- Authenticate first, then route actual static files through `env.ASSETS.fetch(request)`.
- Do not send framework chunks such as `/_next/static/*`, `/assets/*`, fonts, CSS, or client manifests through a framework request handler that may return a 404 instead of falling through to the asset binding.
- Keep only the minimum sign-in and OAuth callback surface public. Verify that public responses contain no private page text, serialized state, filenames, metadata, or user data.
- Prefer route-pattern `run_worker_first` configuration when it can express the boundary without a wrapper.

### 5. Configure secrets and deploy safely

1. Declare required secret names with `secrets.required` when the installed Wrangler version supports it.
2. Add secrets interactively with `wrangler secret put NAME`. Do not pass values as shell arguments.
3. Use a dry run or build before deployment. Inspect the generated Wrangler configuration when using the Cloudflare Vite plugin or another adapter.
4. Deploy while `workers.dev` remains disabled if the boundary is incomplete. Remember that Wrangler can re-enable it when config and dashboard disagree.
5. Enable only the intended route after Access or the OAuth wrapper is ready.
6. Preserve a rollback target or previous Worker version.

### 6. Verify the privacy boundary

Run the bundled anonymous verifier with at least one real deployed asset path and several private phrases:

```bash
node ~/.codex/skills/deploy-private-cloudflare-site/scripts/verify-private-boundary.mjs \
  --url https://example.workers.dev \
  --asset /assets/app.js \
  --forbid "private dashboard" \
  --forbid "customer name"
```

Then verify manually in a clean browser context:

1. Anonymous root is redirected to sign-in or returns 401/403.
2. The public sign-in response contains none of the private phrases.
3. A real JavaScript/CSS/image path is also redirected or denied, not 200 or 404.
4. An allowlisted identity completes sign-in and the app hydrates.
5. A non-allowlisted identity is denied.
6. Sign-out and expired/tampered sessions fail closed.
7. Test every alternate hostname, preview URL, and old deployment.
8. Confirm mobile layout and core navigation after hydration.

Do not use a guessed asset path: an anonymous 404 proves only that the path is absent.

### 7. Diagnose production failures with evidence

- Use `wrangler tail` or Workers Logs immediately for 1101/exception responses.
- Inspect browser Network and Console panels when HTML loads but navigation or tabs do not work.
- Compare response status, content type, cache headers, and body for HTML and a known framework chunk.
- Test the smallest failing deployed request before changing architecture.
- Apply the error-specific checks in [references/troubleshooting.md](references/troubleshooting.md).

### 8. Handoff

Report:

- the canonical private URL and every other route's disposition;
- the protection architecture and exact allowlist, without secrets;
- build, tests, deploy version, anonymous verification, and authenticated verification;
- any OAuth testing-mode expiry, verification requirement, Access plan constraint, or non-Google identity caveat;
- rollback instructions and where future agents should update the allowlist.

Never state that a site is private merely because its root redirects. Privacy requires testing real assets and alternate routes too.
