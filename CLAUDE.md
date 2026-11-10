# portfolio

Static personal site served by GitHub Pages straight from `main` (no build step): `index.html`, `css/`, `js/`,
`data/`, `assets/`. Serve with `python3 -m http.server 8000` from the repo root.

## Git workflow (pr mode)
<!-- git-workflow:pr — checked by the git-workflow plugin's guard hook; keep this marker -->
- Never commit to main, never merge a PR, never force-push. If a branch falls behind main, merge main into it.
- One branch per issue or feature: `feat/<issue#>-<slug>`, `fix/<issue#>-<slug>`.
- Conventional Commits 1.0.0, subject line only unless the why isn't obvious from the diff.
  Breaking changes: `!` after the type and a `BREAKING CHANGE:` footer.
- Run `git add` and `git commit -m "<subject>"` as separate commands, never chained.
- PR title is a conventional commit (it becomes the squash commit on main).
  Body: what, why, how tested, open questions, `Closes #N`.
- Review comments: fix what's clear, ask on the PR when ambiguous, reply to every thread.
