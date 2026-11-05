# RISE — Vision Capacity Diagnosis

An immersive, editorial, responsive web application implementing the **RISE: Vision Capacity Diagnosis** framework.

This application translates the 9-stage visionary framework into a reflective self-diagnostic journey that guides participants from self-discovery to leadership and enduring impact.

---

## 🏛️ The RISE Framework Architecture

The framework consists of **9 interconnected pillars** organized into **4 overarching dimensions**:

```
[E] EXPAND    09. LEAD         "Can I develop others and sustain the impact?"  (Deep Plum)
              08. SCALE        "Can I multiply the results?"
─────────────────────────────────────────────────────────────────────────────
[S] START     07. BUILD        "Can I produce consistent results?"            (Terracotta)
              06. LAUNCH       "Have I initiated it?"
─────────────────────────────────────────────────────────────────────────────
[I] IMAGINE   05. ARCHITECT    "How will I achieve it?"                       (Muted Blue)
              04. ARTICULATE   "Can I communicate it?"
─────────────────────────────────────────────────────────────────────────────
[R] REALISE   03. CRYSTALLIZE  "What future do I envision?"                   (Deep Forest Green)
              02. CLARIFY      "What matters?"
              01. IDENTITY     "Who am I?"
```

**Core Guiding Principle:**
> *"Discover yourself. Define your direction. Design your future. Declare your vision. Engineer your strategy. Launch your undertaking. Build your capacity. Scale your impact. Lead your legacy."*

---

## ✨ Key Features & User Experience Flow

1. **Screen 01: Welcome & Journey Overview**
   - Introduces the framework with an editorial headline.
   - Interactive, vertical bottom-to-top visual journey progression (Identity at bottom $\rightarrow$ Lead at top).
   - Distinct dimensional color families.

2. **Screen 02: Personalisation**
   - Collects participant's first name only (no emails, phone numbers, or passwords).
   - Strict validation: single-word first name, trimmed, 40-character maximum.
   - Personalizes transitions, introductions, and the final results report.

3. **Screens 03–11: Nine Pillar Experiences**
   - **Pillar Introduction**: Stage badge, dimension token, governing question, concise description, and tailored greeting.
   - **Diagnostic Questions**: 7 statements presented **one per screen** (63 total questions).
   - **5-Point Response Scale**:
     5. Completely true of me
     4. Mostly true of me
     3. Somewhat true of me
     2. Rarely true of me
     1. Not true of me
   - **Dual Progress Indication**: Pillar progress (1–7) and overall assessment progress (1–63).
   - **Full Keyboard Navigation**: Keys `1`–`5` to select, `Enter` to continue, `ArrowLeft`/`Backspace` to go back.
   - **Pillar Completion & Transition**: Meaningful transition screens introducing the next pillar with its respective color grouping.

4. **Screen 12: Phased Processing Experience**
   - Real-time calculations with actual submitted responses.
   - Animated progress bar and phased contextual status indicators (0–15%, 16–30%, 31–45%, 46–60%, 61–75%, 76–90%, 91–100%).

5. **Screen 13: Personalised Results & Diagnostic Profile**
   - **Overall Score**: Score out of 315, overall index percentage, and interpretation band.
   - **9-Axis Radar Chart**: Custom SVG radar visualization calibrated to a consistent 0–100% scale.
   - **Development Breakdown**: All 9 pillars grouped under the 4 dimensions with expandable diagnostic interpretations.
   - **Demonstrable Strengths**: Highlights the participant's top 3 performing anchors.
   - **Areas Requiring Attention**: Identifies bottom 3 developmental frontiers.
   - **Strategic Priorities**: Sequential, dependency-aware recommendations with "Why it matters", "What to focus on", and "Practical next action".
   - **Actions**: Print / Save PDF report, Retake assessment modal.
   - **Persistence**: Built-in `localStorage` persistence preserves answers during navigation and browser refreshes.

---

## 🎨 Visual Design System

- **Design Personality**: Premium, editorial, minimal, and reflective.
- **Background**: Warm Ivory (`#FAF8F5`).
- **Primary Text**: Charcoal (`#191817`).
- **Typography**: 
  - Headings: Editorial Serif (`Newsreader` / `Playfair Display`).
  - Interface & Body: Clean Sans-Serif (`Plus Jakarta Sans` / `Inter`).
  - Metrics & Numbers: Tabular figures (`font-mono` / tabular-nums).
- **Dimension Color Tokens**:
  - `R` — Realise: Deep Forest Green (`#1D3B2E`)
  - `I` — Imagine: Muted Blue (`#254465`)
  - `S` — Start: Terracotta (`#9E4424`)
  - `E` — Expand: Deep Plum (`#522846`)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended; v20+ / v26 supported)
- npm (v9 or higher)

### Installation
Clone or navigate to the project directory and install dependencies:
```bash
npm install
```

### Development Server
Run the local development server:
```bash
npm run dev
```

Open `http://localhost:5173/` in your browser.

**Keyboard Navigation for Testing:**
- Simply tap the **Right Arrow (`→`)** on your keyboard to advance forward screen by screen through the entire journey.
- Tap the **Left Arrow (`←`)** to navigate backward to previous screens.
- Keys `1`–`5` can be used to rate questions. When pressing `→` on an unanswered question, it automatically selects a score and advances, allowing you to fluidly review the entire prototype hands-free.

### Running QA Tests
To verify all 9 pillars, 63 diagnostic questions, scoring formulas, and edge cases:
```bash
npm test
```

### Production Build
To create an optimized production build:
```bash
npm run build
```
The output will be placed in the `dist/` directory, ready to be deployed to any static host (Vercel, Netlify, Cloudflare Pages, GitHub Pages, or S3/CloudFront).

---

## 📁 Project Architecture

```
RISE/
├── index.html                   # HTML entry point with web fonts
├── package.json                 # Scripts and dependencies
├── tailwind.config.js           # Design tokens, fonts, and dimensional colors
├── vite.config.ts               # Vite configuration
├── run-tests.mjs                # Comprehensive automated QA test suite
├── src/
│   ├── types.ts                 # TypeScript interfaces for pillars, questions, results
│   ├── main.tsx                 # React entry point
│   ├── App.tsx                  # Assessment controller & screen state management
│   ├── index.css                # Global styles and print media rules
│   ├── data/
│   │   ├── dimensions.ts        # R-I-S-E dimension colors and metadata
│   │   ├── pillars.ts           # 9 pillars with governing questions and introductions
│   │   └── questionBank.ts      # Structured bank of all 63 diagnostic questions
│   ├── utils/
│   │   ├── scoring.ts           # Scoring engine, radar math, and priority algorithms
│   │   └── storage.ts           # LocalStorage state persistence
│   └── components/
│       ├── WelcomeScreen.tsx           # Vertical 9-pillar bottom-to-top overview
│       ├── PersonalisationScreen.tsx   # First name input with validation
│       ├── PillarIntroScreen.tsx       # Reusable pillar introduction card
│       ├── QuestionScreen.tsx          # 1-at-a-time diagnostic question screen
│       ├── PillarTransitionScreen.tsx  # Stage completion & next preview
│       ├── ProcessingScreen.tsx        # Phased 0-100% calculation transition
│       ├── RadarChart.tsx              # Interactive SVG 9-axis radar chart
│       ├── ResultsScreen.tsx           # Comprehensive diagnostic report & print view
│       └── ProgressBar.tsx             # Dual-level hairline progress indicator
```

---

## 🗄️ Question Bank Maintenance

The question bank is cleanly separated from the interface logic in `src/data/questionBank.ts`. 

To update or refine question wording without altering the assessment mechanics, edit the diagnostic statements in `src/data/questionBank.ts`. Each question adheres to the data schema:

```typescript
{
  id: 'pillarname-1',
  pillarId: 'pillarname',
  pillarNumber: 1, // 1 to 9
  questionNumber: 1, // 1 to 7
  text: 'I have a clear...',
  active: true,
}
```

---

## 🖨️ Printing & PDF Export

The results page features dedicated print stylesheets (`@media print` in `src/index.css`). When clicking **"Print / Save PDF"**, the browser's native print dialogue formats the report into a clean, borderless document suitable for archiving or sharing.

