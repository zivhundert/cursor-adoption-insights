# Contributing to Cursor Analytics Dashboard

Thank you for considering contributing! We welcome issues, feature requests, and pull requests.

## Development setup
- Node.js LTS (v20 recommended)
- npm 10+

Steps:
1. Fork and clone the repository
2. Install dependencies: `npm i`
3. Start dev server: `npm run dev`
4. Build to verify: `npm run build`

## Project guidelines
- Tech stack: Vite + React + TypeScript + Tailwind + shadcn-ui
- Use the design system: Tailwind semantic tokens (index.css, tailwind.config.ts). Avoid hard-coded colors.
- Prefer small, focused components and hooks
- Keep accessibility and responsiveness in mind
- Write clear, self-documenting code and comments where needed

## Commit and PR
- Use Conventional Commits (feat, fix, docs, chore, refactor, test, ci)
- Create a feature branch from main
- Ensure `npm run build` and `npm run lint` pass
- Add/Update tests if applicable
- Open a PR with a clear description and screenshots if UI changes

## Reporting bugs and requesting features
- Use the GitHub issue templates
- Provide steps to reproduce and expected behavior

Thanks for your contributions!