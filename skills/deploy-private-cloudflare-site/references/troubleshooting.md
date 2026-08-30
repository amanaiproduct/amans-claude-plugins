# Production troubleshooting

Start with a real failing request, `wrangler tail`, Workers Logs, and the browser Network panel. Avoid speculative rewrites.

## Error 1042

Meaning: a Worker tried to fetch another Worker in the same zone.

Checks:

1. Find plain `fetch(request)` or a fetch back to the public Worker hostname.
2. If the intent is to serve a bundled static file, use `env.ASSETS.fetch(request)` instead of a same-zone network fetch.
3. If a public same-zone fetch is truly required, read the current [Cloudflare error documentation](https://developers.cloudflare.com/workers/observability/errors/) and evaluate the `global_fetch_strictly_public` compatibility flag.
4. Do not add the flag blindly; it changes which same-zone public fetches are supported and may conceal an architectural loop.

## Error 1101

Meaning: the Worker threw a JavaScript exception.

Checks:

1. Start `wrangler tail` and reproduce exactly once.
2. Read the exception and stack before editing.
3. Check production-only nullability. Headers such as `Cookie` may be `null`; helpers should tolerate absent input, for example `String(cookieHeader ?? "")`.
4. Add a regression test for the observed production input.
5. Redeploy and reproduce the smallest request.

Cloudflare explicitly recommends Workers Logs or `wrangler tail` for exceptions: [Errors and exceptions](https://developers.cloudflare.com/workers/observability/errors/).

## HTML loads but the app does not hydrate

Symptoms include dead tabs/buttons, missing client-rendered elements, or no React/Vue hydration errors despite a 200 document.

Checks:

1. Inspect the page's actual script and stylesheet URLs.
2. Request a known chunk in the authenticated browser session.
3. Verify it returns 200 with a JavaScript or CSS content type, not 404 `text/plain` or an HTML sign-in response.
4. If a Worker wrapper handles every request, route authenticated framework assets directly to `env.ASSETS.fetch(request)`.
5. Keep unauthenticated asset requests gated. Direct-to-assets routing happens only after authentication.
6. Check the generated asset manifest and uploaded build output for the exact filename.

Framework request handlers often do not fall through to the Static Assets binding after returning their own 404. This is why authentication can succeed while hydration still fails.

## OAuth redirect mismatch

Google requires exact callback matching. Compare:

- `https` versus `http`;
- hostname and worker name;
- path spelling and case;
- trailing slash;
- the deployed URL versus preview or old URL.

Update the authorized redirect URI in the correct Google OAuth Web client, not merely the consent-screen homepage.

## Google says access is blocked or the user is unauthorized

Check both allowlists:

1. Google Auth Platform Audience test users, while the app is in Testing.
2. The application's exact email allowlist.

Also check whether Testing authorization expired, whether the wrong Google Cloud project/client is active, and whether a non-Gmail private-relay address is being incorrectly treated as Google-authoritative.

## Browser or OAuth cannot open in a headless agent

Use the documented Wrangler `--browser=false` or device authorization flow. If the task depends on an already signed-in user browser, control that browser only with user authorization. Never request raw browser cookies or the user's password.

For the Cloudflare API MCP, the user completes Cloudflare OAuth in their browser and selects permissions. For CI, use a narrowly scoped Cloudflare API token created through the supported UI/API.

## workers.dev unexpectedly becomes public again

The Wrangler configuration is authoritative on deploy. If the dashboard disables `workers.dev` but config does not set `workers_dev: false`, a later Wrangler deploy may re-enable it.

Check all of:

- source Wrangler config;
- framework-generated Wrangler config;
- dashboard Domains & Routes;
- preview URLs;
- custom domains and old deployments.

Official reference: [workers.dev configuration](https://developers.cloudflare.com/workers/configuration/routing/workers-dev/).

## Verification gives a false sense of safety

- A redirected root does not prove assets are protected.
- A 404 asset response does not prove protection; it may be a guessed or stale path.
- An Incognito window may still have identity-provider state.
- A successful allowlisted login does not prove a non-allowlisted identity is denied.
- A private canonical hostname does not make old Sites, Pages, preview, or `workers.dev` URLs private.

Use a real build asset, manual redirect handling, forbidden-content scans, an authenticated session, a rejected identity, and an alternate-route inventory.
