---
name: mobile-wedding-card
description: >-
  Use when the user wants to create, scaffold, customize, audit, test, or deploy a mobile wedding card (mobile invitation website).
  Covers full mobile wedding invitation architecture: config-driven JSON data binding, responsive mobile layouts (max 440px),
  romantic typography & color themes, falling petals animation, interactive D-Day countdown & calendar,
  swipeable photo gallery lightbox, Google Apps Script serverless RSVP & guestbook backend,
  Kakao/Naver map integrations, clipboard account copy, sharp image optimization, JSDOM blank-page verification tests,
  and GitHub Pages auto-deployment.
---

# Mobile Wedding Card Skill (모바일 청첩장 제작 스킬)

This skill guides any AI agent (Antigravity, Claude Code, Cursor, Windsurf, Roo Code, Copilot, etc.) in interactively creating, customizing, testing, and deploying production-grade, highly responsive, and aesthetically refined **Mobile Wedding Invitations (모바일 청첩장)**.

---

## 🤖 Agent Execution Modes

When a user requests to create or customize a mobile wedding card, choose the appropriate flow:

### Mode A: Interactive Agent Chat Interview (Recommended for conversational AI)
If the user interacts in chat:
1. **Interview the Couple**: Gather their desired sections and details in an organized, friendly manner:
   - **Preferred Sections**: Ask which components they want to include:
     - 📅 Calendar & D-Day Countdown
     - 🖼️ Photo Gallery & Lightbox
     - 🗺️ Location & Map/Transit Guidance
     - 💳 Bank Accounts (Accordion)
     - 💌 RSVP Attendance Survey
     - 💬 Guestbook Board
     - 🔗 Share Buttons
     - 🌸 Falling Petals Animation
   - **Groom & Bride**: Names, phone numbers, parents' names & deceased status.
   - **Wedding Schedule**: Date & time (e.g. `2027-01-24 13:10`), Venue name, Hall name, and Address.
   - **Bank Accounts**: (If accounts section is selected) Groom & bride side bank names, account numbers, and account holders.
   - **Visual Theme**: 
     - *1. Romantic Rose (Default)*: Soft pink & warm beige.
     - *2. Classic Elegance*: Deep navy & champagne gold.
     - *3. Modern Pure*: Minimalist black & white.
2. **Scaffold & Apply**: Copy templates from `templates/` to the target directory, retain only the selected sections in `index.html`, and write `data/config.json` with the gathered values.
3. **Verify & QA**: Run `npm test` (`node test_render_jsdom.js`) to ensure zero blank-page errors.

### Mode B: Interactive CLI Wizard (`scripts/init.js`)
If running in a terminal or user prefers terminal prompts:
```bash
npm run init [target-directory]
# or
node scripts/init.js [target-directory]
```
The wizard prompts for couple details, dates, venues, accounts, and themes, then automatically scaffolds and configures the ready-to-run project.

---

## 🌟 Key Architecture & Philosophy

1. **Zero Framework Overhead (Pure Vanilla HTML/CSS/JS)**:
   - Ultra-fast First Contentful Paint (FCP), zero build step required for static hosting (GitHub Pages, Vercel, Netlify, S3).
   - 100% compatibility across mobile Safari (iOS), Chrome (Android), and in-app webviews (KakaoTalk, Line, Instagram).

2. **Configuration-Driven Architecture (`data/config.json`)**:
   - All text, names, dates, venues, bank accounts, transportation info, and API endpoints are cleanly separated from HTML markup.
   - The entire invitation is customizable simply by modifying `config.json`.

3. **Serverless RSVP & Guestbook (`Google Apps Script` + `Google Sheets`)**:
   - Free, permanent, zero-maintenance backend for receiving guest attendance and celebratory guestbook messages with password-based deletion.

4. **Safety & Quality Guarantee (JSDOM Headless QA & Sharp Image Optimizer)**:
   - Automated JSDOM test prevents blank-page accidents caused by broken JSON, missing DOM elements, or runtime syntax errors before deployment.
   - Automated `sharp` image optimizer reduces multiple megabyte wedding photography to lightweight web-ready assets without visible quality loss.

---

## 📁 Standard Project Directory Structure

```text
wedding-card/
├── data/
│   └── config.json            # Centralized wedding metadata
├── css/
│   ├── variables.css          # Color palette, font tokens, layout widths
│   ├── base.css               # Reset, typography, animations
│   ├── components.css         # Buttons, modals, forms, toast, petals overlay
│   └── sections.css           # Section-specific layouts
├── js/
│   ├── app.js                 # Dynamic rendering, countdown, calendar, RSVP, guestbook
│   └── petals.js              # Falling flower petals ambient overlay
├── images/
│   ├── final/                 # Optimized images (01.jpg ~ 15.jpg, new_main.jpg)
│   └── org/                   # High-res originals (optional)
├── google_apps_script.js      # Copy-paste backend code for Google Apps Script
├── optimize_images.js         # Image compression utility (Sharp)
├── test_render_jsdom.js       # Pre-deployment blank-page verification
├── deploy.sh                  # One-click test & deploy script
├── package.json               # Dev dependencies (jsdom, sharp)
└── index.html                 # Main single-page application entry
```

---

## 🚀 Step-by-Step Workflow for Agents

### Step 1: Scaffolding a New Wedding Card
To create a new wedding card project in a target folder:
```bash
node scripts/scaffold.js /path/to/target-project
```
Then run `npm install` in the project directory to install `jsdom` and `sharp`.

### Step 2: Customizing Information (`data/config.json`)
Edit `data/config.json` with the couple's details:
- **`groom` & `bride`**: First name, last name, phone numbers, parents' names and deceased status (`deceased: true/false`).
- **`wedding`**: ISO 8601 date string (`"2027-01-24T13:10:00+09:00"`), venue name, hall name, address.
- **`accounts`**: Bank name, account number, account holder name for groom & bride side.
- **`transport`**: Subway, bus, and parking guidance.
- **`rsvp_api_url`**: Google Apps Script web app endpoint.
- **`kakao_app_key`**: Kakao JavaScript API key for KakaoTalk sharing.

### Step 3: Setting up the Serverless Backend
Follow the [Google Apps Script Backend Setup Guide](./references/backend-setup.md):
1. Create a Google Spreadsheet with two sheets: `참석여부` and `방명록`.
2. Open **Extensions > Apps Script** and paste `google_apps_script.js`.
3. Replace the spreadsheet ID in `google_apps_script.js`.
4. Deploy as **Web App** (Execute as: `Me`, Who has access: `Anyone`).
5. Copy the deployment URL into `data/config.json` -> `rsvp_api_url`.

### Step 4: Adding and Optimizing Images
1. Place the couple's photo files in `images/final/` (e.g. `new_main.jpg`, `01.jpg`, `02.jpg`, ...).
2. Run the image optimization script:
   ```bash
   node optimize_images.js
   ```
   This automatically scales high-res images down to max 1600px and applies MozJPEG compression (saving 80-90% bandwidth).

### Step 5: Visual Effects & Theming
- **Falling Petals**: Configured in `js/petals.js` and `css/components.css`. Adjust `PETAL_COUNT`, gradients, or drift amplitude as desired.
- **Theme Palettes**: Modify `css/variables.css` to switch between:
  - *Romantic Rose* (Default: `#d099a1`, `#f8f5f3`)
  - *Classic Navy & Gold* (`#1f2d3d`, `#d4af37`, `#fafafa`)
  - *Modern Pure Minimalist* (`#2b2b2b`, `#8a8a8a`, `#f5f5f5`)

### Step 6: Testing & Quality Assurance
Run headless DOM validation before any deployment:
```bash
npm test
```
The test verifies:
- Main couple names & wedding date are rendered without blank text.
- Parent badge relationship hierarchy is populated correctly.
- Bank account accordions have valid contents.
- Petal animation container is initialized.
- No uncaught JavaScript exceptions occurred during lifecycle execution.

### Step 7: Deployment
Use `deploy.sh` for safe token-based GitHub Pages deployment:
```bash
./deploy.sh
```

---

## 📚 References & Guides
- [Backend Setup Guide (Google Apps Script & Sheets)](./references/backend-setup.md)
- [Design, Themes & Customization Guide](./references/customization-guide.md)
- [Troubleshooting & Mobile Webview Compatibility](./references/troubleshooting.md)
