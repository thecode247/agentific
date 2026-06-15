# Deployment status & next steps

## ✅ Live now
- **Repo:** https://github.com/thecode247/agentific
- **Host:** GitHub Pages (branch `main`, root). Build status: **built** ✓
- **Custom domain configured:** `agentific.in`
- The site is already served by GitHub's servers; it just needs DNS pointed at it.

## ⏳ You must do these two things

### 1. Point DNS for agentific.in → GitHub Pages
Right now `agentific.in` resolves to `76.223.105.230` / `13.248.243.5` (a parking
page / other service). At your domain registrar's DNS panel, replace the apex (`@`)
records with these **four A records**:

```
A   @   185.199.108.153
A   @   185.199.109.153
A   @   185.199.110.153
A   @   185.199.111.153
```

(Optional but recommended — IPv6 AAAA records:)
```
AAAA  @  2606:50c0:8000::153
AAAA  @  2606:50c0:8001::153
AAAA  @  2606:50c0:8002::153
AAAA  @  2606:50c0:8003::153
```

For the `www` subdomain, add:
```
CNAME  www   thecode247.github.io.
```

DNS usually propagates in 15 min–1 hr. Then in the repo → **Settings → Pages**,
once the cert is issued, tick **Enforce HTTPS**. Your site will be live at
**https://agentific.in**.

Verify propagation:
```bash
dig +short agentific.in        # should show the 185.199.x.x addresses
```

### 2. Connect Supabase for lead capture
So the contact form saves leads into your database:
1. Create a project at https://supabase.com
2. SQL Editor → run `supabase/migrations/0001_leads.sql`
3. Settings → API → copy **Project URL** + **anon public** key into
   `assets/js/config.js`
4. Commit & push:
   ```bash
   git add assets/js/config.js && git commit -m "Connect Supabase lead capture" && git push
   ```
   GitHub Pages redeploys automatically in ~1 min. Leads then appear in
   Supabase → Table Editor → `leads`.

Until step 2 is done, the form falls back to opening the visitor's email app to
amit.gulati@gmail.com — so it works today either way.

## Updating the site later
Edit files, then:
```bash
git add -A && git commit -m "your message" && git push
```
GitHub Pages rebuilds automatically.
