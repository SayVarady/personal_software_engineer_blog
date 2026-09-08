# Deploying This Laravel App to Vercel

Laravel doesn't run on Vercel the way it runs on a normal VPS: the filesystem is
**read-only except `/tmp`**, there's no persistent disk between requests, and
every request goes through a single PHP serverless function via the
[`vercel-php`](https://github.com/vercel-community/php) runtime. Most of the
errors below come from Laravel defaults assuming a normal writable server.

---

## 1. Step-by-step deploy guide

### Prerequisites
- `vercel` CLI installed and logged in (`vercel login`)
- Project linked to a Vercel project (`vercel link`)

### One-time setup

1. **`api/index.php`** — entrypoint the PHP runtime executes. Just forwards to
   Laravel's normal front controller:
   ```php
   <?php
   require __DIR__ . '/../public/index.php';
   ```

2. **`vercel.json`** — tells Vercel how to build/route the app (final version):
   ```json
   {
       "version": 2,
       "framework": null,
       "functions": {
           "api/index.php": { "runtime": "vercel-php@0.7.1" }
       },
       "routes": [
           { "src": "/(.*\\.(?:css|js|mjs|ico|png|jpg|jpeg|gif|svg|webp|avif|woff2?|ttf|eot|map|txt|xml|json))", "dest": "/public/$1" },
           { "src": "/(.*)", "dest": "/api/index.php" }
       ],
       "env": {
           "APP_ENV": "production",
           "APP_DEBUG": "true",
           "APP_URL": "https://<your-vercel-domain>.vercel.app",

           "APP_CONFIG_CACHE": "/tmp/config.php",
           "APP_EVENTS_CACHE": "/tmp/events.php",
           "APP_PACKAGES_CACHE": "/tmp/packages.php",
           "APP_ROUTES_CACHE": "/tmp/routes.php",
           "APP_SERVICES_CACHE": "/tmp/services.php",
           "VIEW_COMPILED_PATH": "/tmp",
           "CACHE_STORE": "array",
           "SESSION_DRIVER": "cookie",
           "LOG_CHANNEL": "stderr"
       }
   }
   ```

3. **`.vercelignore`** — keep local/dev-only files out of the uploaded bundle
   (the CLI uploads your local directory, not just git-tracked files):
   ```
   /vendor
   .env
   .env.*
   storage/framework/cache/data
   storage/framework/sessions
   storage/framework/views
   storage/logs
   ```

4. **`bootstrap/app.php`** — trust Vercel's edge proxy so Laravel generates
   correct `https://` URLs (see error #4 below):
   ```php
   ->withMiddleware(function (Middleware $middleware): void {
       $middleware->trustProxies(at: '*', headers: Request::HEADER_X_FORWARDED_FOR
           | Request::HEADER_X_FORWARDED_HOST
           | Request::HEADER_X_FORWARDED_PORT
           | Request::HEADER_X_FORWARDED_PROTO);
   })
   ```

5. **Set secrets in the Vercel dashboard (not `vercel.json`)**:
   ```
   vercel env add APP_KEY production
   ```
   Paste a freshly generated key from `php artisan key:generate --show`.
   Add any DB/mail/etc. credentials the same way if the app needs them.

6. **Check for stale dashboard env vars** that silently override
   `vercel.json`'s `"env"` block:
   ```
   vercel env ls
   ```
   Remove anything left over from earlier attempts with
   `vercel env rm <NAME> production`.

### Deploy

```bash
vercel --prod
```

### Verify

```bash
curl -I https://<your-domain>.vercel.app/
curl -I https://<your-domain>.vercel.app/css/site.css
```
Both should return `200`. Then open the site in a browser and confirm styles
actually render (curl succeeding doesn't guarantee the browser will load a
resource — see error #4).

---

## 2. Errors hit during this deployment, why they happened, and the fix

### Error 1 — Cache write fails on read-only filesystem

```
file_put_contents(/var/task/user/storage/framework/cache/data/f6/80/...): Failed to open stream: No such file or directory
```

**Why it happened:** Vercel's serverless functions have a read-only
filesystem except `/tmp`. Laravel's `file` cache driver
(`config/cache.php`) hardcodes its path to `storage_path('framework/cache/data')`,
which doesn't exist/isn't writable at runtime. `CACHE_STORE=file` was active
in production (see Error 2 for why).

**Fix:** Don't use the `file` cache driver on Vercel at all. Set
`CACHE_STORE=array` (in-memory, per-invocation) in `vercel.json`'s `env`
block. Also set `LOG_CHANNEL=stderr`, since the default `single` log channel
has the exact same problem writing to `storage/logs/laravel.log`. Note that a
plain `CACHE_PATH` env var does **nothing** here — stock `config/cache.php`
never reads it, it's hardcoded to `storage_path()`.

### Error 2 — Same error persists after the fix (env var precedence)

**Why it happened:** Two separate issues stacked:

1. `vercel` CLI uploads your **local working directory**, not just
   git-tracked files. `.vercelignore` only excluded `/vendor`, so the local
   `.env` (with `CACHE_STORE=file`, `SESSION_DRIVER=file` from local dev) was
   bundled into the deployment. Laravel's `Dotenv::load()` fills in any env
   var not already set by the real OS environment, so `.env`'s `file` values
   leaked into production for anything `vercel.json` didn't already override.
2. Even after fixing `vercel.json` and `.vercelignore`, the error was
   **identical** on redeploy. Cause: Vercel Dashboard project Environment
   Variables (Settings → Environment Variables) take precedence over the
   `"env"` block in `vercel.json`. An earlier attempt had added `CACHE_STORE`
   and `SESSION_DRIVER` directly as dashboard Secrets — those were silently
   shadowing every `vercel.json` change.

**Fix:**
- Add `.env` and `.env.*` to `.vercelignore` so local config/secrets never
  get uploaded.
- Audit dashboard env vars with `vercel env ls` and remove stale overrides:
  ```
  vercel env rm CACHE_STORE production
  vercel env rm SESSION_DRIVER production
  ```
- Rotate any secret that was accidentally exposed (e.g. printed in a
  terminal/log/chat) — regenerate `APP_KEY` with
  `php artisan key:generate --show` and set it via
  `vercel env add APP_KEY production` rather than committing it anywhere.

### Error 3 — CSS/JS return 404 in production

**Why it happened:** `vercel.json`'s original routing sent **every** request
to the PHP function:
```json
"routes": [{ "src": "/(.*)", "dest": "/api/index.php" }]
```
That includes `/css/tailwind.css` and `/css/site.css`. Laravel's router has
no route for those paths, so it returns its own 404 instead of ever reaching
the real files sitting in `public/css/`. Confirmed by the fact that the same
files were reachable directly at `/public/css/tailwind.css` (200) — they
were deployed fine, just never routed to.

**Fix:** Add a routing rule that serves static asset extensions directly
from `public/` before the catch-all route to PHP:
```json
"routes": [
    { "src": "/(.*\\.(?:css|js|mjs|ico|png|jpg|jpeg|gif|svg|webp|avif|woff2?|ttf|eot|map|txt|xml|json))", "dest": "/public/$1" },
    { "src": "/(.*)", "dest": "/api/index.php" }
]
```

### Error 4 — Page loads, but no styling shows in the browser

**Why it happened:** `curl` on the CSS URLs returned `200`, but the browser
still didn't apply the styles. Inspecting the generated HTML showed every
internal link/asset URL rendered as `http://...` even though the page itself
was served over `https://`:
```html
<link rel="stylesheet" href="http://hobby-sable-seven.vercel.app/css/tailwind.css">
```
Browsers block `http://` stylesheets/scripts loaded from an `https://` page
as **mixed content** — `curl` doesn't enforce that policy, which is why it
looked fine from the command line. Root cause: Vercel terminates TLS at its
edge and forwards the request to the PHP function over plain HTTP with an
`X-Forwarded-Proto: https` header, but Laravel wasn't configured to trust
that proxy header, so it assumed the request was plain `http` when
generating URLs.

**Fix:** Trust Vercel's edge as a proxy in `bootstrap/app.php` so Laravel
honors `X-Forwarded-Proto` (and related headers) when building URLs:
```php
->withMiddleware(function (Middleware $middleware): void {
    $middleware->trustProxies(at: '*', headers: Request::HEADER_X_FORWARDED_FOR
        | Request::HEADER_X_FORWARDED_HOST
        | Request::HEADER_X_FORWARDED_PORT
        | Request::HEADER_X_FORWARDED_PROTO);
})
```
Also corrected the placeholder `APP_URL` in `vercel.json` (was
`https://yourproductionurl.com`) to the real deployed domain.

---

## 3. Outstanding / worth revisiting

- `APP_DEBUG` is currently `"true"` in `vercel.json` for production — fine
  while actively debugging, but should be set back to `"false"` before
  treating this as a stable production deployment (debug mode leaks stack
  traces and file paths to visitors).
- `CACHE_STORE=array` means the cache resets on every cold start / between
  invocations — fine for a low-traffic blog with no expensive cached
  computations, but if that changes, consider a real external cache
  (e.g. `database` store against an external Postgres/MySQL, since a local
  `sqlite` file won't persist/be writable on Vercel either).
