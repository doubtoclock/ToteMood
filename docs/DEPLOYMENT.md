# Deployment checklist

## Render backend

Create the service from this repository with `backend` as its root directory.
`render.yaml` uses a reproducible install, generates Prisma Client, and runs
`prisma migrate deploy` before `npm start`.

Set these values in Render's environment-variable UI; do not put credentials
in `render.yaml` or source control:

- `NODE_ENV=production`
- `DATABASE_URL` — pooled/runtime Postgres URL
- `DIRECT_URL` — direct Postgres URL used by Prisma migrations
- `CORS_ORIGINS` — comma-separated exact origins, for example the final Vercel
  URL and any approved custom domain. Wildcards are not supported.
- `SESSION_SECRET` — at least 32 random bytes
- `ADMIN_PASSWORD_HASH` — password hash, never a plaintext password
- `GOOGLE_CLIENT_ID`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `RAZORPAY_WEBHOOK_SECRET`

The existing GoKwik integration is enabled, so also configure its existing
`GOKWIK_APP_ID`, `GOKWIK_APP_SECRET`, `GOKWIK_MERCHANT_ID`, and `GOKWIK_ENV`
variables when it is used.

Configure Razorpay's webhook URL as
`https://<render-service-domain>/api/webhooks/razorpay` and subscribe at least
to `payment.captured` and `payment.failed`. Its webhook secret must match
`RAZORPAY_WEBHOOK_SECRET`. A request received without that secret configured is
intentionally rejected with HTTP 503 so Razorpay retries instead of treating it
as delivered.

Before the first production deploy, restore a disposable database copy and run
`npx prisma migrate deploy` there. Confirm that any existing
`PendingCheckout.data` values are valid JSON: the reviewed migration converts a
legacy text column to `JSONB` and safely stops rather than discarding invalid
records. Do not run this validation or migration against the production
Supabase database from a developer machine.

## Vercel frontend

Import the repository with `frontend` as the Root Directory. The included
`frontend/vercel.json` uses `npm ci` and `npm run build`.

Set only public browser configuration with these names:

- `NEXT_PUBLIC_API_URL` — final HTTPS Render API origin
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` — OAuth client ID, if Google sign-in is enabled
- `NEXT_PUBLIC_SITE_URL` — final HTTPS Vercel/custom-site origin

Do not use `NEXT_PUBLIC_` for passwords, session secrets, Razorpay secrets,
database URLs, service-role keys, or webhook secrets. After Vercel assigns its
final URL, add that exact URL to Render's `CORS_ORIGINS` and redeploy the
backend.

## Node and validation

The project declares Node `>=20.9 <25` and includes `.nvmrc` for Node 22. The
previous local build failure occurred under Node 26, which is outside that
range. Use Node 22 locally and in the hosting platforms before validating a
release build.

The postponed product-image storage migration remains outside this release:
existing Base64 product image references are preserved and no product storage
bucket or migration job is required to deploy.

The historical test credential was removed from the Playwright spec. Any
credential that appeared in Git history must be rotated manually through the
appropriate identity/secret-management process; this change does not rewrite
history or rotate live credentials.

## Remaining security follow-up

Account and admin bearer tokens are currently held in browser storage. This
release limits server-side data exposure and keeps authorization checks on the
API, but a future authentication redesign should use secure, HttpOnly cookies
to reduce the impact of any XSS flaw. The existing CSP still allows inline and
evaluated scripts for current third-party/Next behavior; replacing those with
nonces or hashes needs a separately tested rollout and has not been changed
blindly here.
