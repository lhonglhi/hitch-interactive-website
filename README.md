# Hitch Interactive Website (light theme, matching hitchinteractive.com)

Static bilingual (EN/中文) site. No build step.

Repo: https://github.com/lhonglhi/hitch-interactive-website (this folder is the repo root).

## Deploy (live at hitchinteractive.com since 2026-07-22)
Same GoDaddy cPanel git flow as hitchopen.ai — push to the `production` remote and
`.cpanel.yml` copies the site into `~/public_html/` (the account's main-domain docroot):

    git remote add production ssh://zl8tgqhjlwtn@208.109.68.15/home/zl8tgqhjlwtn/repositories/hitch-interactive-website
    git push production main

Notes:
- Sucuri WAF fronts the domain; after a deploy, changed pages may serve a cached
  copy for a few hours unless purged in the Sucuri dashboard.
- The old WordPress site is archived on the server at ~/wp-archive-hitchinteractive-20260722/
  (files + htaccess); DB untouched in MySQL. Full backups also in Website/备份/ locally.
- GitHub Pages preview: https://lhonglhi.github.io/hitch-interactive-website/

## Launch at localhost
    cd website
    python3 -m http.server 8000
Then open http://localhost:8000

## Official logo
Save https://hitchinteractive.com/wp-content/uploads/2023/11/cropped-Logo300x100.png
into  assets/logo.png  — all pages use it automatically (SVG wordmark is the fallback).

## Language auto-detection
zh-CN browser locale or China-mainland timezone → Chinese; otherwise English.
Manual EN/中文 toggle in the nav overrides and is remembered. For true geo-IP in
production, front with Cloudflare and use the CF-IPCountry header.

## Pages
index.html (news carousel) · learning.html · superstore.html · services.html
