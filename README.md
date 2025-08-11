# Cursor Analytics Dashboard

Open-source dashboard to analyze developer adoption and productivity using Cursor IDE telemetry exports. Built with Vite, React, TypeScript, Tailwind, and shadcn-ui.

## Features
- KPI cards (AI code %, acceptance rate, hours and cost savings, ROI)
- Charts: cumulative usage, request types over time, model usage, day-of-week, treemap, and more
- AI Adoption Champions table with sortable metrics
- CSV upload (no server required) and export to image
- Theme switching and per-chart visibility settings

## Quick start
```bash
# 1) Install deps
npm i

# 2) Run the dev server
npm run dev

# 3) Build for production
npm run build
```

## Tech stack
- Vite + React + TypeScript
- Tailwind CSS + shadcn-ui
- Highcharts (via highcharts-react-official)

## Privacy
This project is client-side only. If you enable analytics (gtag) in your hosting environment, events are anonymous. See src/services/analytics.ts. The in-app footer also clarifies that no personal information is stored.

## License
This repository is licensed under the MIT License. See LICENSE for details.

Note about Highcharts: While this code is MIT, Highcharts itself is commercially licensed. You may need a valid Highcharts license to use it in production. See https://www.highcharts.com/license

## Contributing
We welcome contributions! Please read CONTRIBUTING.md for the development workflow and coding standards. By participating, you agree to abide by our CODE_OF_CONDUCT.md.

## Security
Please report security issues privately. See SECURITY.md for instructions.

## Credits
Built with Lovable.dev. Original project scaffold and scripts adapted from Lovable templates.
