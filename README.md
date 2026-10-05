# CampusConnect 🎓✨

> **Your Campus. Your Opportunities. Personalized by AI.**

CampusConnect is an AI-powered college updates and opportunities platform designed for university students. It centralizes internships, hackathons, scholarships, campus announcements, workshops, competitions, and placement drives into one intelligent interface.

Instead of showing the same generic feed to every student, CampusConnect analyzes each student's profile (department, academic year, skills, interests, and career goals) and delivers personalized recommendations with transparent match scores and actionable AI-generated explanations.

---

## 🌟 Core Features

### 1. 🤖 AI Recommendation & Matching Engine
- **Algorithmic Compatibility Score (0–100%)**:
  - **Skill Match (40%)**: Compares student technical and soft skills with opportunity requirements.
  - **Interest Match (25%)**: Aligns domain interests (e.g., AI/ML, Web Dev, Cybersecurity).
  - **Eligibility Match (20%)**: Enforces academic year and departmental eligibility.
  - **Career Goal Match (10%)**: Benchmarks against long-term aspirations (e.g., AI Engineer, Software Architect).
  - **Preference Match (5%)**: Filters work mode (Remote, Hybrid, On-site) and stipend criteria.
- **"Why This Matches You" Explanations**: Powered by Google Gemini (`gemini-3.8-flash`), generating transparent bullet points grounded strictly in verified profile data.

### 2. 🔍 Semantic AI Search ("Ask CampusConnect")
- Natural language query interpreter:
  - *"Find AI internships for third-year IT students that don't require previous experience"*
  - *"What hackathons are closing this week?"*
  - *"Show me paid remote internships with Python"*
- Queries are translated into structured criteria and matched against live database listings without hallucinating non-existent opportunities.

### 3. 💬 CampusConnect AI Assistant
- Floating student assistant on call across every screen.
- Answers questions about approaching deadlines, highest-match hackathons, resume preparation tips, and team requirements using real database state.

### 4. 📢 Campus Announcements with AI Summaries (TL;DR)
- Official circulars categorized into *Academic, Placement, Department, Clubs, Events, Exams, Workshops, and General*.
- Priority classification (*Urgent, High, Medium, Low*).
- Instant 1–2 sentence AI summaries highlighting the core action item, eligible batch, and deadline.

### 5. 📊 Application Pipeline & Deadline Urgency Indicators
- **Traffic-Light Urgency Indicators**:
  - 🟢 **More than 7 days** left
  - 🟡 **Within 7 days** left
  - 🔴 **Approaching deadline** (≤3 days left)
- Full lifecycle status management: *Saved → Planning to Apply → Applied → Interview → Selected → Rejected → Completed*, with notes.

### 6. 👤 Guided Student Onboarding & Profile Completeness
- 6-step multi-step onboarding wizard capturing academic background, skills, interests, and career trajectory.
- Live Profile Completeness gauge with tips to reach 100% profile strength.

### 7. 🛡️ Admin Dashboard & Analytics
- Recharts visualizations: applications over time, opportunities by category, and student engagement.
- Opportunity creator with automated **AI Skill & Benefit Extraction**.
- Circular publishing tool with automated **AI Summarization**.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS v4 |
| **Icons & UI** | Lucide React, Motion, Custom Design System |
| **Charts** | Recharts (Area, Bar, and Distribution Charts) |
| **Backend / Database** | Google Cloud Firestore (NoSQL Document Store) |
| **Authentication** | Firebase Authentication (Email/Password & Google Sign-In) |
| **AI / LLM** | Google Gemini API (`@google/genai` SDK with `gemini-3.8-flash`) |
| **API Server** | Node.js Express / Vite Server Middleware Proxy |

---

## 📁 Project Structure

```text
campusconnect/
├── firebase-applet-config.json # Firebase connection parameters
├── firebase-blueprint.json     # Intermediate Representation (IR) schema
├── firestore.rules             # ABAC Zero-Trust security rules
├── index.html                  # HTML entry point with metadata and fonts
├── package.json                # Project dependencies and scripts
├── tsconfig.json               # TypeScript compiler configuration
├── vite.config.ts              # Vite configuration & server middleware
└── src/
    ├── main.tsx                # React application entry point
    ├── App.tsx                 # Main layout and route controller
    ├── index.css               # Global styles & Tailwind CSS imports
    ├── types/
    │   └── index.ts            # TypeScript definitions (Opportunity, User, etc.)
    ├── context/
    │   └── AuthContext.tsx     # Authentication, role switching & profile state
    ├── firebase/
    │   ├── config.ts           # Firebase SDK initialization & error handlers
    │   └── seedData.ts         # High-fidelity realistic student & campus seed data
    ├── services/
    │   ├── firebaseService.ts  # Firestore CRUD operations & offline caching
    │   ├── matchingEngine.ts   # Algorithmic scoring formula & AI explanations
    │   └── aiService.ts        # Client interface for Gemini AI endpoints
    ├── server/
    │   ├── geminiService.ts    # Server-side @google/genai calls & system prompts
    │   └── apiHandler.ts       # HTTP request dispatcher for /api/gemini/*
    ├── components/
    │   ├── layout/
    │   │   ├── Navbar.tsx      # Responsive desktop & mobile header with notifications
    │   │   └── BottomNav.tsx   # Mobile-first sticky bottom navigation
    │   └── common/
    │       ├── OpportunityCard.tsx   # Opportunity card with match score & tags
    │       ├── OpportunityModal.tsx  # Detailed view with application tracker
    │       ├── MatchScoreBadge.tsx   # Animated match percentage indicator
    │       ├── AnnouncementCard.tsx  # Circular card with AI TL;DR summary
    │       └── AIAssistantModal.tsx  # Floating CampusConnect AI chat assistant
    └── pages/
        ├── LandingPage.tsx           # Modern brand landing page with interactive preview
        ├── StudentDashboard.tsx      # Main student dashboard with KPI metric cards
        ├── DiscoverPage.tsx          # Multi-faceted search & filter catalog
        ├── AISearchPage.tsx          # "Ask CampusConnect" natural language search
        ├── CampusUpdatesPage.tsx     # Filterable announcements and circulars
        ├── SavedOpportunitiesPage.tsx# Bookmarked opportunities with deadline urgency
        ├── ApplicationTrackingPage.tsx # Kanban application pipeline & statistics
        ├── NotificationsPage.tsx     # Notification center with categorized alerts
        ├── ProfilePage.tsx           # Profile editor with completeness indicator
        ├── AdminDashboard.tsx        # Admin control panel with Recharts analytics
        ├── AuthModal.tsx             # Sign in, Sign up & quick demo accounts
        └── OnboardingModal.tsx       # 6-step student profile setup wizard
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm** or **bun** / **yarn** / **pnpm**
- **Google Gemini API Key**: Obtainable from Google Cloud / AI Studio

---

### Step 1: Clone the Repository

```bash
git clone https://github.com/your-username/campusconnect.git
cd campusconnect
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Populate `.env` with your credentials:

```env
# Google Gemini API Key
GEMINI_API_KEY="your_gemini_api_key_here"

# Application URL
APP_URL="http://localhost:3000"
```

### Step 4: Configure Firebase (Optional for Custom Deployments)

The project includes an automatic local storage fallback and pre-seeded realistic data for instant evaluation out of the box.

To connect your own Firebase project:
1. Update `firebase-applet-config.json` with your Firebase project credentials (`projectId`, `apiKey`, `authDomain`, `firestoreDatabaseId`, `storageBucket`).
2. Deploy the security rules:
   ```bash
   firebase deploy --only firestore:rules
   ```

### Step 5: Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Available Scripts

- `npm run dev` — Starts the Vite dev server with server-side Gemini AI middleware on port 3000.
- `npm run build` — Compiles TypeScript and builds the production bundle in `dist/`.
- `npm run preview` — Locally previews the built production application.
- `npm run lint` — Runs TypeScript type-checking (`tsc --noEmit`).

---

## 🔒 Security & Privacy

- **Server-Side AI Secrets**: The Gemini API key is accessed strictly in server-side handlers (`src/server/geminiService.ts`) and is never sent to the browser bundle.
- **Attribute-Based Access Control (ABAC)**: Firestore rules enforce that students only read public opportunities and manage their own saved opportunities, profile data, applications, and notifications.
- **Bootstrapped Admin Access**: Only verified administrators can create, edit, or delete college opportunities and announcements.

---

## 📄 License

This project is licensed under the Apache-2.0 License.
