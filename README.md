# Hitch Interactive Website (light theme, matching hitchinteractive.com)

Static bilingual (EN/中文) site. No build step.

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
