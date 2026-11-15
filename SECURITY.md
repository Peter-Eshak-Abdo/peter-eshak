# Security policy

This is a fully static personal site. There is no server, database, login, form or third-party script at runtime.

## Reporting a vulnerability

Please report privately, either through **GitHub → Security → Report a vulnerability** on this repository or by email to petereshak11@gmail.com. Please don't open a public issue. I'll reply within 7 days.

## What's in place

| Layer | Measure |
| --- | --- |
| Scripts | A strict per-page Content-Security-Policy that allows only `'self'` plus the exact SHA-256 hash of each inline script (`scripts/postbuild.mjs`), with no `unsafe-eval` |
| Integrity | Subresource Integrity (`sha384`) on every first-party script and stylesheet |
| Transport | HSTS for 2 years with `includeSubDomains` and `preload`; `upgrade-insecure-requests` |
| Isolation | COOP `same-origin`, COEP `require-corp`, CORP `same-origin`, `Origin-Agent-Cluster`, `frame-ancestors 'none'` and `X-Frame-Options: DENY` |
| Browser features | `Permissions-Policy` denies camera, microphone, geolocation, payment, USB, sensors and more |
| Other headers | `nosniff`, strict referrer policy, `base-uri 'none'`, `form-action 'none'`, `object-src 'none'` |
| Links | Every external link uses `rel="noopener noreferrer"` |
| Supply chain | Dependencies audited in CI (`npm audit`); GitHub Actions pinned to commit SHAs; Dependabot updates both |
| CI | Least-privilege tokens, `persist-credentials: false`, and no secrets exposed to fork PRs |
| Privacy | Fonts are self-hosted, with no analytics or trackers. Build-time GitHub data comes only from public repositories |
