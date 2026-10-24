# ExamiNation — Online Examination Management System

An academic and enterprise examination management single-page application (SPA) built with React 18, Vite, Framer Motion, and Firebase. ExamiNation provides an end-to-end testing platform supporting multiple question formats, live proctoring integrity monitoring, instant automated grading, and role-based administration dashboards.

---

## Key Features

### 1. Assessment & Testing Engine
- **Multiple Question Typologies:**
  - **Multiple Choice Questions (MCQ):** Single-choice questions with randomized options and per-question score weighting.
  - **True / False:** Binary concept checks with instant state tracking.
  - **Fill-in-the-Blank:** Text inputs evaluated against acceptable answer variations and synonym arrays.
- **Timed Exam Sessions:** Synchronized countdown clock with color-coded warning states when time is running low.
- **Question Navigation Matrix:** Interactive palette allowing students to jump between answered, unvisited, and flagged questions.

### 2. Proctoring & Exam Integrity
- **Tab & Window Focus Tracking:** Detects when a student switches tabs or blurs the browser window, incrementing a violation counter and displaying a warning banner.
- **Fullscreen Mode Enforcement:** Requests fullscreen execution on exam start to discourage secondary windows.
- **Clipboard & Context Menu Protection:** Intercepts cut, copy, paste events and disables the context menu within the exam interface.
- **Automated Submission Safeguards:** Submits candidate progress automatically when the countdown expires or maximum proctoring violation thresholds are breached.

### 3. Student & Administrator Dashboards
- **Executive Overview:** Key performance metrics, active exams catalog, average test scores, and recent assessment history.
- **Exam Catalog (`ExamsView`):** Filter and search assessments by subject (*Computer Science*, *Artificial Intelligence*, *Software Engineering*) and difficulty (*Beginner*, *Intermediate*, *Advanced*).
- **Question Bank Explorer (`QuestionsView`):** Review subject questions, distribution of question types, correct answers, and point allocations.
- **Results Analytics (`ResultsView` & `AnalyticsView`):** Comprehensive score distributions, pass/fail ratios, duration statistics, and violation audit trails.
- **Student Directory (`StudentsView`):** Enrolled candidate roster with assessment counts and performance summaries.
- **Theming & Preferences (`SettingsView`):** High-contrast Dark Mode and Light Mode with persistence in `localStorage`.

### 4. Grading, Review & Feedback
- **Instant Automated Grading:** Real-time percentage calculation and pass/fail evaluation against exam-specific pass marks.
- **Visual Feedback:** Celebratory confetti animation upon passing exams.
- **Post-Exam Answer Audit:** Question-by-question breakdown comparing candidate selections against correct answers with explanatory commentary.
- **Session History:** Exam results and violation records stored in `localStorage` with optional synchronization to Firebase Firestore.

### 5. Flexible Authentication
- **Firebase Auth:** Production authentication supporting Email/Password sign-up/login and Google Sign-In.
- **Offline / Demo Mode:** Built-in demo authentication fallback allowing testing without Firebase credentials (student demo credentials and pre-configured administrator access).

---

## Tech Stack

- **Frontend Core:** [React 18](https://react.dev/) & [React DOM 18](https://reactjs.org/)
- **Bundler & Build Tool:** [Vite 5](https://vitejs.dev/)
- **Animations & Transitions:** [Framer Motion 11](https://www.framer.com/motion/)
- **Iconography:** [Lucide React](https://lucide.dev/)
- **Confetti Effects:** [Canvas Confetti](https://www.kirilv.com/canvas-confetti/)
- **Backend & Cloud:** [Firebase 12](https://firebase.google.com/) (Firebase Auth & Cloud Firestore)
- **Styling:** Vanilla CSS with custom properties (CSS variables), CSS Grid, and responsive flexbox layouts

---

## Project Structure

```
Online-Examination-Management/
├── .env.example               # Environment variables template
├── .gitignore                 # Git ignore rules for node, vite, and environment files
├── index.html                 # HTML entry point with web font preconnects
├── LICENSE                    # MIT License
├── package.json               # Project manifest, dependencies, and scripts
├── package-lock.json          # Dependency lockfile
├── README.md                  # Comprehensive repository documentation
├── vite.config.js             # Vite configuration with React plugin
└── src/
    ├── main.jsx               # Application entry point and StrictMode wrapper
    ├── App.jsx                # Top-level state machine, screen routing, theme provider
    ├── index.css              # Global styles, typography tokens, light/dark themes
    ├── components/
    │   ├── Dashboard.jsx      # Dashboard parent container and exam preview modal
    │   ├── ErrorBoundary.jsx  # React error boundary component for crash protection
    │   ├── ExamScreen.jsx     # Active exam proctoring, question renderer, timer
    │   ├── LoginPage.jsx      # Authentication screen (Firebase + Demo login)
    │   ├── ResultPage.jsx     # Result breakdown, review mode, proctoring summary
    │   ├── common/
    │   │   ├── EmptyState.jsx # Fallback illustration and prompt for empty tables
    │   │   ├── Skeleton.jsx   # Loading state shimmer placeholders
    │   │   └── StatCard.jsx   # Metrics KPI card component
    │   ├── dashboard/
    │   │   ├── AnalyticsView.jsx # Performance metrics and pass rate breakdown
    │   │   ├── ExamsView.jsx     # Filterable exam cards and launch triggers
    │   │   ├── OverviewView.jsx  # Primary dashboard landing view
    │   │   ├── QuestionsView.jsx # Subject question bank explorer
    │   │   ├── ResultsView.jsx   # Historical examination score reports
    │   │   ├── SettingsView.jsx  # Application configuration and themes
    │   │   └── StudentsView.jsx  # Student directory table
    │   └── layout/
    │       ├── MobileNav.jsx     # Mobile viewport navigation bar
    │       ├── NotificationsPopover.jsx # Notification alert menu
    │       ├── Sidebar.jsx       # Desktop drawer navigation
    │       └── Topbar.jsx        # App header with theme toggle and user profile
    ├── data/
    │   └── exams.js           # Static exam syllabi, questions, and demo leaderboards
    └── firebase/
        ├── auth.js            # Firebase authentication listeners, login, register
        ├── config.js          # Firebase app initialization and configuration check
        └── firestore.js       # Firestore subscriptions for live counts and leaderboards
```

---

## Prerequisites

- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher

Verify your local environment:
```bash
node -v
npm -v
```

---

## Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/nfsprogramming/Online-Examination-Management.git
   cd Online-Examination-Management
   ```

2. **Install dependencies:**
   ```bash
   npm ci
   ```

3. **Configure environment variables (optional for live Firebase):**
   Copy the `.env.example` file to create a local `.env` file:
   ```bash
   cp .env.example .env
   ```
   Populate `.env` with your Firebase project credentials:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id

   # Administrator credentials for demo/admin role access
   VITE_ADMIN_USER=admin
   VITE_ADMIN_PASS=admin123
   ```
   > **Note:** If no `.env` file is provided or `VITE_FIREBASE_API_KEY` is omitted, the application automatically runs in **Offline / Demo Mode**, allowing full testing using local state and mock data without external network dependencies.

---

## Development & Usage

- **Start local development server:**
  ```bash
  npm run dev
  ```
  Vite will launch the local development server (typically at `http://localhost:5173/`).

- **Build production bundle:**
  ```bash
  npm run build
  ```
  Generates an optimized, tree-shaken static bundle in the `dist/` directory.

- **Preview production build locally:**
  ```bash
  npm run preview
  ```

---

## Releases & Downloads

Pre-built production bundles are available under [GitHub Releases](https://github.com/nfsprogramming/Online-Examination-Management/releases). Each release includes a standalone zipped distribution package (`online-examination-management-vX.Y.Z-dist.zip`) accompanied by cryptographic SHA-256 checksums.

---

## Contributing

Contributions, bug reports, and suggestions are welcome.
1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/improvement`).
3. Commit your changes (`git commit -m "Add new feature"`).
4. Push to the branch (`git push origin feature/improvement`).
5. Open a Pull Request.

---

## License

This project is licensed under the [MIT License](LICENSE). See the [LICENSE](LICENSE) file for details.
