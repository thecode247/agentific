# Agentific — agentific.in

A modern, lead-focused marketing site for Agentific: deploying AI agents into
organisations, with a spotlight on higher education.

## What's inside

```
index.html                         Landing page (hero, services, education use cases, lead form)
insights/
  index.html                       Insights & case studies hub
  case-study-transparency.html     Governance reporting case study
  case-study-admissions.html       Admissions triage case study
  article-ai-higher-ed.html        "5 places to start" strategy article
assets/
  css/style.css                    Brand styling
  js/main.js                       Nav, scroll reveal, counters, lead-form handling
  js/config.js                     ← put your Supabase keys here
supabase/
  migrations/0001_leads.sql        The `leads` table + security policy
scripts/
  deploy-supabase-storage.sh       Optional: host the static files on Supabase Storage
```

Tech: plain HTML + Tailwind (Play CDN) + vanilla JS. No build step. Images from
[Unsplash](https://unsplash.com) (free to use), icons are inline SVG.

---

## Preview locally

```bash
cd "/Users/amitgulati/Desktop/@Apps/Agentific"
python3 -m http.server 5173
# open http://localhost:5173
```

---

## Lead capture with Supabase (recommended)

Every form submission is saved into a `leads` table in your Supabase database,
so you never lose a prospect.

1. **Create a project** at https://supabase.com (free tier is fine).
2. **Create the table.** In the dashboard → SQL Editor, paste the contents of
   [`supabase/migrations/0001_leads.sql`](supabase/migrations/0001_leads.sql) and run it.
   *(Or, after `supabase login` + `supabase link --project-ref <ref>`, run `supabase db push`.)*
3. **Add your keys.** Dashboard → Project Settings → API. Copy **Project URL** and the
   **anon / public** key into [`assets/js/config.js`](assets/js/config.js):
   ```js
   window.AGENTIFIC_CONFIG = {
     SUPABASE_URL: "https://YOUR_REF.supabase.co",
     SUPABASE_ANON_KEY: "eyJhbGciOi..."
   };
   ```
   The anon key is *meant* to be public — the security policy in the SQL lets visitors
   **insert** leads but never **read** them.
4. **View your leads** anytime in Dashboard → Table Editor → `leads`. Set up an email
   alert via Supabase → Database → Webhooks if you want a ping on each new lead.

If you leave `config.js` empty, the form gracefully falls back to opening the
visitor's email app addressed to amit.gulati@gmail.com — so it still works day one.

---

## Hosting — two options

### Option A (recommended): static host + Supabase for leads
Supabase is a backend (database/auth/storage), not a website host, and it can't
cleanly serve the apex domain `agentific.in`. Host the static files on a free static
host that supports custom domains, and keep Supabase for lead capture (above).

- **Cloudflare Pages / Netlify / Vercel** — drag-and-drop this folder, or connect a Git repo.
- Point `agentific.in` at the host (each provider gives you the exact DNS records).

### Option B: everything on Supabase Storage
If you want the site itself on Supabase too:

```bash
supabase login
supabase link --project-ref <YOUR_PROJECT_REF>
# create a PUBLIC bucket named "site" in the dashboard, then:
./scripts/deploy-supabase-storage.sh
```

Your site will be served at
`https://<ref>.supabase.co/storage/v1/object/public/site/index.html`.
This URL isn't ideal for branding `agentific.in`, which is why Option A is preferred.

---

## Customising

- **Contact email** is `amit.gulati@gmail.com` throughout — search & replace to change.
- **Brand colour** lives in the Tailwind `brand` config (top of each HTML file) and in
  `assets/css/style.css` (`--brand-*`).
- **Add an article**: copy any file in `insights/`, edit the content, and add a card to
  `insights/index.html` and the "Insights" section of `index.html`.
- **Form fields**: edit the `<form id="lead-form">` in `index.html`; matching columns
  exist (or add them) in the `leads` table.

## Image credits
All photographs are from [Unsplash](https://unsplash.com) under the Unsplash License
(free for commercial and non-commercial use).
