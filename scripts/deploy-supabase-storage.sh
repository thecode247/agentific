#!/usr/bin/env bash
# =============================================================
# Deploy the Agentific static site to a Supabase Storage bucket.
#
# Use this if you want EVERYTHING hosted on Supabase. Note: a
# Storage bucket serves your files at a long supabase.co URL and
# is not ideal for mapping the apex domain agentific.in. For a
# marketing site we recommend hosting the static files on
# Netlify / Vercel / Cloudflare Pages (free, supports agentific.in)
# and using Supabase only for lead capture. See README.md.
#
# Prerequisites:
#   1. supabase CLI installed (you have it: `supabase --version`)
#   2. supabase login            # opens browser, one time
#   3. supabase link --project-ref <YOUR_PROJECT_REF>
#   4. A PUBLIC bucket named "site" created in the dashboard
#      (Storage → New bucket → name "site" → Public ✓)
# =============================================================
set -euo pipefail

BUCKET="site"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "Uploading site to Supabase Storage bucket: $BUCKET"

# Upload top-level + folders recursively, overwriting existing objects.
supabase storage cp ./index.html "ss:///$BUCKET/index.html" --experimental
supabase storage cp -r ./assets   "ss:///$BUCKET/assets"    --experimental
supabase storage cp -r ./insights "ss:///$BUCKET/insights"  --experimental

echo ""
echo "Done. Your site is live at:"
echo "  https://<YOUR_PROJECT_REF>.supabase.co/storage/v1/object/public/$BUCKET/index.html"
echo ""
echo "Tip: to map agentific.in cleanly, prefer a static host (see README.md)."
