# Career Catalyst — AI Resume Intelligence Platform

An AI-powered resume analysis platform that parses resumes, matches against job descriptions, generates targeted edit suggestions, and prepares you for interviews. Powered by Claude API.

## Features

- **Resume Intelligence** — Upload/paste any resume text. AI detects sections, maps non-standard headings, extracts skills across industries, and assigns confidence scores.
- **AI Editor** — Get categorized suggestions (ATS Optimization, Stronger Metrics, Skill Coverage, Leadership Framing, etc.) with original vs. improved text, reasoning, and impact level. Apply or dismiss individually.
- **Job Feed** — AI-generated job recommendations matched to your parsed resume with fit types (Strong Fit, Stretch Fit, Skill Gap but Viable, etc.), aligned/gap skills, and match scores.
- **Interview Prep** — Questions generated from your resume + job description analysis, categorized (Resume-Based, JD-Based, Behavioral, Technical, Gap Risk) with STAR hints and follow-up predictions.
- **Export** — 4 export modes (Preserve Original, Enhanced, ATS Clean, Modern Polished) with fidelity scores. Opens print-to-PDF dialog.
- **Share** — Generate shareable links to your analysis. Works via localStorage on same device, or base64-encoded URL for cross-device sharing.
- **Rate Limit Handling** — Detects Claude API usage limits, shows friendly banner, auto-falls back from Sonnet to Haiku model.

## Tech Stack

- **React 18** — UI framework
- **Vite** — Build tool
- **Claude API** — AI analysis (called client-side from the browser)
- **No backend needed** — Everything runs in the browser

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deploy to Netlify

### Option A — Drag & Drop
1. Run `npm run build`
2. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
3. Drag the `dist` folder onto the page
4. Done — you'll get a live URL

### Option B — Git Deploy
1. Push this repo to GitHub
2. Go to [app.netlify.com](https://app.netlify.com) → "Add new site" → "Import an existing project"
3. Connect your GitHub repo
4. Build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
5. Deploy

### Option C — Netlify CLI
```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod --dir=dist
```

## How It Works

1. **Paste resume text** → AI parses sections, detects layout, extracts skills
2. **Optionally paste a job description** → AI generates match score, semantic alignment, edit suggestions, and interview questions
3. **AI generates job recommendations** → 5 varied roles across industries
4. **Browse all 4 modules** — Resume Intelligence, AI Editor, Job Feed, Interview Prep
5. **Export** your improved resume as PDF
6. **Share** a link to your analysis

## API Usage

The app calls the Anthropic Claude API directly from the browser. It uses:
- **Model:** `claude-sonnet-4-20250514` (primary), falls back to `claude-haiku-4-5-20251001`
- **3 API calls per analysis:** parseResume, matchJD, generateJobs
- No API key is needed when running inside Claude artifacts. For standalone deployment, you'll need to add an API key — see "Adding Your API Key" below.

### Adding Your API Key (for standalone deployment)

For deployment outside Claude artifacts, you need to add your Anthropic API key. Edit `src/App.jsx` and find the `askClaude` function. Add your key to the headers:

```js
headers: {
  "Content-Type": "application/json",
  "x-api-key": "YOUR_API_KEY_HERE",        // add this
  "anthropic-version": "2023-06-01",         // add this
  "anthropic-dangerous-direct-browser-access": "true"  // required for client-side calls
},
```

> **Security note:** Embedding an API key in client-side code exposes it publicly. For production, set up a small proxy server/serverless function that holds the key and forwards requests.

## Project Structure

```
career-catalyst/
├── index.html          # Entry HTML
├── netlify.toml        # Netlify SPA routing config
├── package.json        # Dependencies + scripts
├── vite.config.js      # Vite build config
└── src/
    ├── main.jsx        # React entry point
    └── App.jsx         # Full application (~800 lines)
```

## License

MIT
