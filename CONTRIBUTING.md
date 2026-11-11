# Contributing to GPUse — team guide

Hey everyone 👋 This is how we work on this project. Please read your section before you write any code — it will save us all from merge conflicts later.

## The team

| Person | Branch | Your job |
|---|---|---|
| **Aleks** (lead) | `aleks` | Landing, Browse GPUs, My Jobs, login/signup (HTML+CSS) — done. Reviews and merges everything into `main`. |
| **Joen** | `joen` | The remaining HTML+CSS pages: Create a job, Host dashboard, List your GPU. |
| **Endi** | `endi` | JavaScript for: Landing, Browse GPUs, My Jobs, login, signup. |
| **Kostika** | `kostika` | JavaScript for: Create a job, Host dashboard, List your GPU. |

## Golden rules (for everyone)

1. **Work only on your own branch.** Never push directly to `main`.
2. **`main` is Aleks's job.** When your work is ready, open a Pull Request into `main` — Aleks reviews it and merges it.
3. **Small commits.** Commit little and often with clear messages, e.g. `feat: add create job page`, `docs: add host screenshot`.
4. **Sync before you push** (see below). Don't let your branch get weeks behind `main`.
5. If something is unclear or you get a merge conflict you can't solve — **ask Aleks, don't force-push.**

## Start working

```bash
git clone https://github.com/alekslime/gpuse.git
cd gpuse
git checkout <your-branch>     # joen / endi / kostika

# …do your work…
git add .
git commit -m "feat: short description of what you did"
git push
```

## Stay in sync with main

Do this at the start of every work session, and again before opening a Pull Request:

```bash
git checkout <your-branch>
git fetch
git merge origin/main
git push
```

This pulls in whatever Aleks has merged (for example, Joen's pages) so your branch never drifts far away.

---

## Joen — your task: the remaining HTML + CSS

You are building the 3 pages that don't exist yet. **Use exactly these file names** — the nav links in the existing pages already point to them, so any other name will break the links:

| Page | File | Stylesheet |
|---|---|---|
| Create a job | `create.html` | `css/create.css` |
| Host dashboard | `host.html` | `css/host.css` |
| List your GPU | `list-gpu.html` | `css/list-gpu.css` |

Rules for your pages:

- Every page loads 4 stylesheets, in this order: `css/base.css` → `css/components.css` → your page CSS → `css/responsive.css`. Copy the `<head>` block from `browse.html` and just change the page stylesheet name.
- Use the shared stuff that already exists: nav (`.nav`), buttons (`.btn-primary`, `.btn`), panels (`.panel`), form fields (`.field`, `.flabel`), tables. Look at `browse.html` and `my-jobs.html` — copy their header/footer blocks exactly, only change which nav link has `class="active"`.
- Colors are fixed, don't invent new ones: background `#0F0F0F`, panel `#181818`, field `#222222`, border `#383838`, accent lime `#A3FF00`, grey text `#B3B3B3`, dim text `#5A5A5A`. Font is Inter, corner radius 8px.
- **No JavaScript.** That's Endi's and Kostika's job. If a button needs to "do" something, just make it a normal link/button — they will wire it up.
- Design: follow the Figma file (ask Aleks for the page *"GPUse — Easy Build (HTML/CSS/JS)"*). Keep it simple: divs, flex/grid, native inputs/selects — no images.
- When a page is done, take a screenshot (1280px wide) and put it in `screenshots/` (e.g. `screenshots/create.png`).

## Endi — your task: JavaScript for Aleks's pages

You make these pages actually *do* something: `index.html` (landing), `browse.html`, `my-jobs.html`, `login.html`, `signup.html`.

Rules:

- Put your scripts in a new `js/` folder, **one file per page**: `js/landing.js`, `js/browse.js`, `js/my-jobs.js`, `js/login.js`, `js/signup.js`.
- Load your script at the **end of `<body>`**, e.g. `<script src="js/browse.js"></script>`. Don't put scripts in `<head>`.
- The HTML/CSS is Aleks's — **don't rename or remove existing classes** and don't restructure the pages. His CSS will break. You *may* add `id`s or `data-` attributes for your hooks, and small additions are fine — just tell Aleks in your PR what you changed and why.
- Ideas for functionality (confirm priorities with Aleks): Browse = working search + filter chips; My jobs = render the table from a JS data array, download button behaviour; Login/signup = form validation (email format, passwords match, handle starts with `@`); Landing = live-ish stats.
- No frameworks and no build step — plain JavaScript, same as the HTML/CSS is plain. No npm.

## Kostika — your task: JavaScript for Joen's pages

You make these pages work: `create.html`, `host.html`, `list-gpu.html` (Create a job, Host dashboard, List your GPU).

Important: **these pages are Joen's job and don't exist yet.** Your work starts after Joen's pages are merged into `main`. Until then:

- You can already plan and look at the Figma designs (ask Aleks), and skim `browse.html`/`my-jobs.html` to see the code style.
- Once Aleks tells you Joen's pages are merged, run the sync commands above (`git merge origin/main`) to get them on your branch, then start.

Rules (same as Endi's):

- Scripts go in `js/`, one file per page: `js/create.js`, `js/host.js`, `js/list-gpu.js`, loaded at the end of `<body>`.
- **Don't rename or remove existing classes** in Joen's HTML/CSS. Add `id`s / `data-` hooks if you need them, and mention any HTML changes in your PR.
- Ideas for functionality (confirm with Aleks): Create = price estimate updates as you pick GPU/options, fake progress bar when running a job; Host = start/stop sharing toggle, earnings chart from data, wallet numbers; List your GPU = step flow, price inputs.
- Plain JavaScript only. No frameworks, no npm, no build step.

---

## When you're done: Pull Requests

1. Sync with `main` one last time (commands above) and push.
2. On GitHub, open a **Pull Request: your branch → `main`**. Write what you did in the description (which pages, what works, screenshots if it's visual).
3. Aleks reviews it. He may ask for small changes — that's normal, just push the fixes to the same branch and the PR updates itself.
4. Aleks merges. 🎉 Then everyone merges `origin/main` into their branch again.

**Merge order matters:** Joen's pages go into `main` first, because Kostika's JavaScript depends on them. Endi can be merged any time. If we all try to merge on the last day without syncing, we will have a bad day — so sync often.

## Commit message style

Short, lowercase, with a prefix:

- `feat:` — new page or feature (`feat: add host dashboard page`)
- `fix:` — bug fix (`fix: correct price on browse card`)
- `docs:` — README, screenshots, comments (`docs: add create page screenshot`)
- `style:` — CSS-only changes (`style: tighten card spacing`)
