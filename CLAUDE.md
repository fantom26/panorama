# Panorama — Agent Instructions

## Git workflow

`main` is protected: PRs are required, direct pushes are blocked (including for admins), and the `quality` and `web-test` CI checks must pass before merging (see `.github/workflows/ci.yml`).

When starting any task that changes code:

1. Sync `main` first: `git fetch origin && git checkout main && git pull`
2. Create a branch off `main` — never commit directly to `main`. Name it `<type>/<short-kebab-description>`, reusing the conventional-commit types this repo's commitlint config enforces: `feat`, `fix`, `perf`, `a11y`, `refactor`, `test`, `ci`, `build`, `docs`, `chore`.
   Examples: `feat/compare-page`, `fix/turbo-tokens-dependency`.
3. Commit on that branch with conventional-commit messages.

When the task is complete:

4. Push the branch: `git push -u origin <branch>`
5. Open a PR into `main` with `gh pr create` (concise title, summary of the change, test plan if relevant).
6. Leave the PR open for review — do not merge it automatically unless explicitly asked to. Merging deploys to production via Vercel's auto-deploy on `main`, so it stays a manual, explicit step.
