# Mobile Wedding Card Skill — Agent Instructions

This repository provides an agent-agnostic skill and scaffolding toolkit for building interactive, production-ready Mobile Wedding Invitations (모바일 청첩장).

---

## 🤖 Guidelines for AI Agents (Antigravity, Cursor, Claude Code, Windsurf, Copilot, etc.)

When a user asks you to create, scaffold, or customize a mobile wedding card:

1. **Interactive Customization**:
   - Act as a thoughtful, friendly pair programmer and wedding planner.
   - Do NOT just generate dummy text blindly. Ask the user for their wedding information or offer to run `npm run init`:
     - 🤵 **Groom & 👰 Bride**: Names, phone numbers, parents' names and deceased status.
     - 📅 **Schedule**: Date, time, venue, hall name, address.
     - 💳 **Accounts**: Bank accounts for groom and bride side.
     - 🎨 **Theme**: Romantic Rose (Default), Classic Navy & Gold, or Modern Pure Monochrome.
     - 🌸 **Ambient Effect**: Falling petals animation toggle.
2. **Project Generation**:
   - Run `node scripts/scaffold.js [target-directory]` or run `node scripts/init.js [target-directory]`.
   - Update `data/config.json` with the user's specific information.
   - If a custom theme is requested, update `css/variables.css`.
3. **Image Processing**:
   - Remind the user to place photos in `images/final/`.
   - Run `node optimize_images.js` to resize & compress assets with MozJPEG.
4. **Pre-deployment Quality Assurance (No Blank Pages)**:
   - Always run `npm test` (`node test_render_jsdom.js`).
   - Ensure all DOM nodes render properly and that there are zero uncaught JS exceptions.
5. **Deployment**:
   - Guide the user on deploying to GitHub Pages or static hosting via `deploy.sh`.
