# GPUse — who does what

Quick guide so we don't step on each other's work.

## Branches

- `main` — the finished stuff. Nobody pushes here directly, Aleks merges into it.
- `aleks` — Aleks: landing, browse GPUs, my jobs, login/signup (done)
- `joen` — Joen: create a job, host dashboard, list your GPU (HTML/CSS)
- `endi` — Endi: JavaScript for landing, browse, my jobs, login, signup
- `kostika` — Kostika: JavaScript for create, host, list your GPU

## Start

```bash
git clone https://github.com/alekslime/gpuse.git
cd gpuse
git checkout yourname
```

Stay on your own branch. That's it, that's the main rule.

Before you push, sync with main first so you don't fall behind:

```bash
git fetch
git merge origin/main
git push
```

When you're done: open a pull request (your branch → `main`) on GitHub and tell Aleks. He'll check it and merge it.

## Joen

You're making the 3 missing pages. Keep the file names exactly like this, the menu links already point to them:

- `create.html` + `css/create.css`
- `host.html` + `css/host.css`
- `list-gpu.html` + `css/list-gpu.css`

Easiest way: copy the top and bottom parts (head, nav, footer) from `browse.html` and change the middle. Every page loads `base.css`, then `components.css`, then your page css, then `responsive.css` — just copy that block from an existing page.

Use the colors that are already there (dark background `#0F0F0F`, lime `#A3FF00`, panels `#181818`). No JavaScript, that's Endi and Kostika.

## Endi

You're adding the JavaScript to: `index.html`, `browse.html`, `my-jobs.html`, `login.html`, `signup.html`.

Put scripts in a `js/` folder, one file per page (`js/browse.js`, etc.) and load it at the end of the body. Please don't rename the CSS classes that are already in the HTML, the styling depends on them. Adding `id`s is fine. Plain JS only, no frameworks.

## Kostika

You're adding the JavaScript to: `create.html`, `host.html`, `list-gpu.html`.

Heads up: those pages don't exist yet, Joen is making them. So your start is after Aleks says Joen's pages are merged. Then just sync (`git merge origin/main`) and you'll have them.

Same deal as Endi: scripts in `js/` (`js/create.js`, etc.), end of body, don't rename existing classes, plain JS only.

## Commits

Little commits, short messages:

- `feat: add create job page`
- `fix: broken link in nav`
- `docs: add screenshot`

Stuck or got a weird merge conflict? Just ask Aleks instead of force-pushing anything.
