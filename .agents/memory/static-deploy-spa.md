---
name: Static deploy SPA fallback
description: How to make client-side routes survive hard-refresh on Replit static deployments for this Vite SPA.
---

# Replit static SPA deep-link refresh

BrowserRouter routes (e.g. `/music-director`, `/settings`) 404 on hard-refresh/deep-link on a static host unless there is an index.html fallback.

**Constraint:** the agent CANNOT edit `.replit` directly (blocked), and `deployConfig({...rewrites})` silently ignores a `rewrites` param — it is NOT persisted to `[[deployment.rewrites]]`.

**Working solution:** Replit static serves a root `404.html` for any unmatched path. So make the deploy build emit one that is a COPY of the *built* `index.html` (must be built, so it carries Vite's hashed `/assets/*` refs):

`build = ["bash","-c","cd frontend && npm install && npm run build && cp dist/index.html dist/404.html"]`

The copied 404.html boots the same app and React Router resolves the route client-side.

**Why:** rewrites are the documented mechanism but unreachable via tooling here; 404.html is the only fallback the agent can configure end-to-end.

**How to apply:** any static SPA publish on this project — keep the `cp dist/index.html dist/404.html` step in the deploy build command, not just the dev build.
