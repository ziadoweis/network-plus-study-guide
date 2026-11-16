# Network+ Study Guide

CompTIA Network+ (N10-009) quizzes, labs and Cisco Packet Tracer labs. A static site with no server or database; progress is stored in each visitor's browser.

## Deploy

**Drag and drop (no build):** upload the contents of the ready-built `dist` folder to https://app.netlify.com/drop, or to your site's *Deploys* page to update it.

**From Git (Netlify builds it):** push this folder to GitHub, then *Add new project → Import from Git* on Netlify. `netlify.toml` already sets the build command (`npm run build`) and publish folder (`dist`).

## Edit and rebuild

Requires Node.js 18+.

```
npm install
npm run build      # writes dist/
npm run preview    # serves dist/ at http://localhost:3000
```

| To change | Edit |
|---|---|
| Site name | `SITE_NAME` in `src/js/core.js` and the `<title>`/menu title in `src/index.html` |
| Quiz questions | `src/js/qb.js` |
| Packet Tracer labs | `src/js/pt-data.js` (the lab index is regenerated on build) |
| Labs and simulators | `src/js/labs.js` |
| Domains, objectives, corrections | `src/js/data.js` |
| Colors and layout | `src/style.css` |

## How it's optimized

- First load is about 10 KB (Brotli): the HTML with inlined CSS plus a small entry script. Quizzes, labs and Packet Tracer labs are separate chunks that load on first visit and are warmed in the background when the browser is idle.
- File names are fingerprinted (`app-XXXX.js`), so `_headers` caches them for a year as immutable; HTML and the service worker always revalidate, so a new deploy shows up at once.
- No web fonts or third-party requests (system font stack).
- A service worker precaches everything, so the guide works offline after the first visit and can be installed as an app.
- `_headers` sets a strict Content-Security-Policy and other security headers.
