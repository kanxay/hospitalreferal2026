# Cloudflare Pages / Workers Deployment Fix (hospitalreferal2026)

Resolve Cloudflare Pages / Worker deployment failure caused by unrecognized Bun lockfile, synchronize project identifier in `wrangler.jsonc`, and configure build settings for standard Node.js and Turso database connectivity.

## User Review & Critical Decisions

> [!IMPORTANT]
> The build failure on Cloudflare was triggered because Cloudflare detected `bun.lock` in the repository and automatically ran `bun install --frozen-lockfile` with Bun v1.2.15, which cannot parse lockfileVersion 2. The answers confirmed in Phase 1 resolve this cleanly without altering application code.

- **Confirmed Decision 1**: Set project name in `wrangler.jsonc` to `hospitalreferal2026` to match Cloudflare Worker/Pages name.
- **Confirmed Decision 2**: Delete `bun.lock` from the project and add all lockfile types (`bun.lock`, `bun.lockb`, `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`) to `.gitignore` so they are never committed to GitHub.
- **Confirmed Decision 3**: Enforce standard Node.js runtime with `npm install --legacy-peer-deps && npm run build` on Cloudflare Pages.

---

## 1. Overview & Root Cause Analysis

### What Happened
1. When Cloudflare detected `bun.lock` in the cloned repo, its build detection system prioritized Bun over Node.js.
2. Bun v1.2.15 failed to parse the lockfile format (`UnknownLockfileVersion: failed to parse lockfile: 'bun.lock'`), causing the entire pipeline to fail before executing your custom `npm install` command.
3. The project name in `wrangler.jsonc` was previously set to `emstransfersystem2026`, which did not match the Cloudflare deployment name `hospitalreferal2026`.

### Expected Outcome
After these changes, Cloudflare will detect only Node.js (`package.json`), skip Bun entirely, run `npm install --legacy-peer-deps && npm run build`, and deploy the Vite single-page application (`dist`) directly to your Cloudflare URL.

---

## 2. Technical Architecture & Deployment Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    GitHub Repository                        │
│               kanxay/hospitalreferal2026                    │
│                                                             │
│   ├── package.json (Vite + React 19 + LibSQL + Tailwind v4)  │
│   ├── wrangler.jsonc (name: "hospitalreferal2026")          │
│   ├── .gitignore (ignores bun.lock, package-lock.json)      │
│   └── [bun.lock removed]                                    │
└──────────────────────────────┬──────────────────────────────┘
                               │ git push / trigger build
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 Cloudflare Pages / Workers                  │
│                                                             │
│   1. Tool Detection: Node.js 20.x (Bun skipped completely)  │
│   2. Build Command: npm install --legacy-peer-deps &&       │
│                     npm run build                           │
│   3. Environment Variables:                                 │
│      - NODE_VERSION = 20                                    │
│      - VITE_TURSO_DATABASE_URL = libsql://...               │
│      - VITE_TURSO_AUTH_TOKEN = eyJ...                       │
│   4. Output Directory: ./dist                               │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│             Live EMSCPS Hospital Referral Web App           │
│           https://hospitalreferal2026.pages.dev             │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Key Product & Configuration Decisions

### Decision 1: Delete Local & Remote Lockfiles
- **Chosen Approach**: Completely remove `bun.lock` from the local workspace and exclude all package lockfiles in `.gitignore`.
- **Why**: Prevents Cloudflare or other CI environments from guessing or switching to incompatible package managers (like Bun frozen lockfile). NPM reads `package.json` dependencies directly.

### Decision 2: Update `wrangler.jsonc`
- **Chosen Approach**: Set `"name": "hospitalreferal2026"` and ensure SPA routing is enabled (`"not_found_handling": "single-page-application"`).
- **Why**: Cloudflare Pages / Workers requires the config name to match the project name in your dashboard.

### Decision 3: Cloudflare Dashboard Build Variables Setup Guide
- **Chosen Approach**: Provide step-by-step instructions for the Cloudflare Pages dashboard:
  - Add `NODE_VERSION: 20` to guarantee Node.js 20 runtime.
  - Add `VITE_TURSO_DATABASE_URL` and `VITE_TURSO_AUTH_TOKEN` for live database persistence.

---

## 4. Execution Steps (Upon Approval)

1. **Delete `bun.lock`**:
   - Remove `bun.lock` from the applet root directory.

2. **Update `.gitignore`**:
   - Add `bun.lock`, `bun.lockb`, `package-lock.json`, `pnpm-lock.yaml`, `yarn.lock`.

3. **Update `wrangler.jsonc`**:
   - Change `"name": "hospitalreferal2026"`.
   - Verify `"compatibility_date"` and SPA asset configuration.

4. **Verify Build**:
   - Run `npm run build` locally to confirm the production bundle compiles in `dist/`.
