# qkix.github.io

The **qkix** website, https://qkix.eu: [Astro](https://astro.build), static, English at `/` and
Polish under `/pl/`. GitHub Pages builds and publishes it on every push to `main`
(`.github/workflows/deploy.yml`; Pages source = GitHub Actions; custom domain `public/CNAME`).

```
npm install
npm run dev          # http://localhost:4321
npm run build        # -> dist/
npm run sync         # copy art, trailers and privacy policies from the games (../arcade)
```

- `src/data/site.ts` – every text (EN + PL), the games (status, screenshots, tester links), socials.
- `src/pages/[...slug].astro` – all pages: `/`, `/<game>/`, `/<game>/privacy/`, `/<game>/test/` (+ `/pl/...`).
- `src/content/privacy/<game>.md` – the policies (binding English text). Source: the game repo's
  `docs/privacy-policy.md` - edit it there, then `npm run sync`.
- `public/` – copied art (`tools/sync_assets.py`: sprites for the home page's diorama, icons, feature
  graphics, store screenshots, trailers), the old `/steer-clear/` redirects, `CNAME`.
- `public/app-ads.txt` – AdMob publisher `pub-1589297262438867` (the Play listing's website must be https://qkix.eu).

Addresses already handed out stay valid: `/<game>/privacy/` (Play Console), `/inchway/test/`
(testers), `/steer-clear/...` (redirects to Inchway). A Polish browser opening an English page
is sent to the Polish one unless the visitor picked a language with the EN / PL switch.

E-mail: Zoho Mail (EU, free plan): mailbox `kk@qkix.eu`, alias `contact@qkix.eu`. DNS at GoDaddy:
4x A + 4x AAAA to GitHub Pages, `www` CNAME qkix.github.io; MX mx/mx2/mx3.zoho.eu, SPF
`include:zohomail.eu`, DKIM `zmail._domainkey`, `zoho-verification` TXT, `_dmarc` p=quarantine.
