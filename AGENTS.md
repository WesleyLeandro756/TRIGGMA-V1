# TRIGGMA-V1

## Cursor Cloud specific instructions

### What this repository is

This repository is **not** a buildable/runnable software application. It is a
**specification, branding, and design-assets repository** for the TRIGGMA SaaS
product (a multi-tenant customer-growth / referral / loyalty platform). The
actual application is intended to be generated/built on an external no-code
platform ("Lovable Cloud"), driven by the prompts and specs stored here.

There is **no dependency manifest** (no `package.json`, lockfile,
`requirements.txt`, etc.) anywhere in the git history, **no application source
code**, **no backend/frontend service**, and **no test suite**. As a result
there is nothing to install, no server to start, and no lint/build/test
commands to run.

### Repository contents

- `docs/` — MVP specifications, data model, multi-tenant architecture, test
  plan, and "Lovable" prompts (mostly in Portuguese).
- `branding/`, `branding/v2/`, `branding/v3/` — logo kits as `.svg` plus
  exported `.png`.
- `mockups/` — screen mockups (`.svg`/`.png`) and demo videos (`.mp4`).
- `scripts/generate-triggma-v3-logos.mjs` — the only runnable code. A
  zero-dependency Node.js ESM script (uses only built-in `fs`/`path`) that
  writes SVG logo files to `branding/v3`.

Note: most assets and the `scripts/` directory currently live on the
`cursor/triggma-mvp-spec-4348` branch rather than `main`. `main` contains only
this file and `README.md`.

### Toolchain

- Node.js (v22 verified) is preinstalled and is all that is needed to run the
  asset-generation script: `node scripts/generate-triggma-v3-logos.mjs`
  (writes to a hardcoded `/workspace/branding/v3` output dir).
- No package installation step is required because there are no third-party
  dependencies. The startup update script is a no-op unless/until a
  `package.json` is added.

### If real application code is added later

If a future change introduces an actual app (e.g. a `package.json` for a web
frontend/backend), update the startup update script to install its
dependencies and document the dev/lint/test/build/run commands here.
