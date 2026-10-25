# qkix.github.io

Static site for **qkix** games, served by GitHub Pages at <https://qkix.eu> (custom domain, `CNAME`; DNS at GoDaddy: 4x A + 4x AAAA to GitHub Pages, `www` CNAME qkix.github.io).

- `index.html` – game list
- `steer-clear/privacy/` – Steer Clear privacy policy (source text: `docs/privacy-policy.md`
  in the steer-clear repo – keep both in sync)
- `app-ads.txt` – to be added once the AdMob publisher ID exists

Plain HTML + `style.css`, no build step (`.nojekyll`).

E-mail: Zoho Mail (EU, free plan): mailbox `kk@qkix.eu`, alias `contact@qkix.eu`. DNS at GoDaddy: MX mx/mx2/mx3.zoho.eu, SPF `include:zohomail.eu`, DKIM `zmail._domainkey`, `zoho-verification` TXT, `_dmarc` p=quarantine.
