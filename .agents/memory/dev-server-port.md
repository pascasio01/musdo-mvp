---
name: Dev server port (Vite on 5000)
description: Why the frontend must serve on port 5000 and how duplicate Vite instances break the preview
---

The Replit preview proxy expects the frontend on **port 5000**. `frontend/vite.config.ts` pins `port: 5000` with `strictPort: true`.

**Why strictPort matters:** without it, if 5000 is already held (e.g. a leftover/zombie Vite from a prior manual run), Vite *silently* falls back to 5001. The workflow looks "running" but the preview pane (which targets 5000) shows a stale or dead server — the classic "preview/splash not updating" symptom.

**How to apply / recover:** if you see "Port 5000 is in use, trying another one..." or two Vite instances in `ps aux | grep vite`, run `pkill -f vite`, then restart the `Start application` workflow so it rebinds 5000 cleanly. Verify with `curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/` (expect 200) and that :5001 is dead. Note the captured workflow log file can be stale — trust a fresh curl/ps over it.
