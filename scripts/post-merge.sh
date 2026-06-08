#!/bin/bash
set -e

# MUSVORA post-merge setup.
# Installs frontend dependencies so a freshly merged task runs cleanly.
# Idempotent + non-interactive (stdin is closed during post-merge).
# Supabase SQL schema changes are applied manually via the Supabase dashboard,
# so there is no migration step here.

cd frontend
npm install --no-audit --no-fund
