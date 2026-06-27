

#  GoalOS AI – Smart Roadmap Generator

##  Overview

GoalOS AI is an intelligent roadmap generation system that transforms user-defined goals into structured, actionable plans. It helps users break down complex goals into monthly, weekly, and daily tasks using AI-powered logic with real-time progress tracking, streak monitoring, calendar scheduling, and PDF export.

---

##  Problem Statement

Many individuals struggle to achieve their goals because they don't know how to break them into smaller, manageable steps. This leads to inconsistency, lack of clarity, and eventual failure.

---

##  Solution

GoalOS AI solves this problem by:

* Generating structured roadmaps based on user goals with **dynamic duration support** (60 days → 9 weeks automatically)
* Breaking goals into **monthly, weekly, and daily tasks**
* Providing a **fallback system** if AI API fails
* Tracking **daily streaks** and habit completion across sessions
* Visualizing **week-by-week progress** on a goal calendar
* Exporting the full roadmap as a **professionally formatted PDF**

---

##  Tech Stack

### Frontend

* React (Vite)
* Tailwind CSS
* JavaScript (ES Modules)
* jsPDF (client-side PDF generation)
* canvas-confetti (completion celebrations)

### Backend

* Node.js
* Express.js
* REST API Architecture
* Axios (API calls)

### AI Integration

* OpenRouter API — `openai/gpt-3.5-turbo-0125` (LLM-based roadmap generation)
* Custom fallback logic (works without API key)

---

##  Features

### Core
*  AI-powered roadmap generation
*  Dynamic duration parsing — "60 days", "3 months", "8 weeks" all work correctly
*  Monthly, Weekly, Daily task breakdown scaled to actual goal duration
*  Fallback system (works even without OpenRouter API key)
*  Clean modular backend architecture

### Progress Tracking
*  Weekly task checkboxes with per-week completion bars
*  Overall progress ring (animated circular gauge)
*  Confetti celebration on task/week/goal completion

### Daily Streak System *(new)*
*  Daily habit checkboxes that reset each day automatically
*  🔥 Streak counter — tracks consecutive days all habits were completed
*  Last 7-day heatmap — green (all done), indigo (partial), empty (missed)
*  Streak data persists independently from roadmap resets

### Goal Calendar *(new)*
*  Start date picker — set when you begin your goal
*  Automatic end date calculation based on total weeks
*  Week-by-week date ranges (e.g. Week 1: Jul 1 – Jul 7)
*  Current week highlighted with **NOW** badge
*  Completed weeks marked green, past weeks faded

### PDF Export *(new)*
*  One-click Export PDF button in the dashboard header
*  Cover page — goal title, category, difficulty, stats cards, progress bar
*  Monthly milestones section with descriptions
*  Weekly roadmap — each week's tasks with checkbox state (✓ or empty)
*  Completion-aware styling — completed weeks render in green
*  Auto-named file: `GoalOS_Learn_React_in_60_Days.pdf`

---

##  Project Structure

```
GOAL-OS/
├── backend/
│   ├── controllers/
│   │   └── goalController.js       # Route handler
│   ├── services/
│   │   ├── aiService.js            # OpenRouter API + fallback logic
│   │   └── roadmapService.js       # Local dynamic roadmap generator
│   ├── .env                        # API keys (not committed)
│   └── server.js                   # Express entry point
│
├── src/
│   ├── components/
│   │   ├── RoadmapCard.jsx         # Weekly + monthly display
│   │   ├── ProgressBar.jsx         # Reusable progress bar
│   │   ├── CalendarPanel.jsx       # Goal calendar with date ranges  ← new
│   │   └── DailyStreak.jsx         # Streak tracker + heatmap        ← new
│   ├── hooks/
│   │   └── useRoadmapPDF.js        # PDF generation hook              ← new
│   ├── pages/
│   │   ├── Dashboard.jsx           # Main dashboard (updated)
│   │   └── Home.jsx                # Goal input page
│   └── services/
│       └── roadmapAPI.js           # Frontend API caller + normalizer
│
├── public/                         # Static files
└── README.md
```

---

##  How to Run Locally

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/goal-os.git
cd goal-os
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Create `.env` file:

```env
OPENROUTER_API_KEY=your_api_key_here
PORT=5000
```

Run backend:

```bash
npm start
```

### 3. Setup Frontend

```bash
cd ..
npm install jspdf        # Required for PDF export
npm run dev
```

---

##  API Endpoint

### Generate Roadmap

```
POST /api/generate
```

**Request Body**

```json
{
  "goal": "Learn React in 60 days"
}
```

**Response**

```json
{
  "goal": "Learn React in 60 days",
  "category": "Frontend Development",
  "difficulty": "Intermediate",
  "estimatedTime": "9 Weeks",
  "monthly": [
    { "id": "m1", "title": "Month 1 Focus: React Framework Mastery", "description": "..." },
    { "id": "m2", "title": "Month 2 Focus: Hooks, State & Testing",  "description": "..." },
    { "id": "m3", "title": "Month 3 Focus: Performance & Deployment", "description": "..." }
  ],
  "weekly": [
    {
      "id": "w1",
      "title": "Week 1: React & JSX Core Setup",
      "description": "...",
      "duration": "Week 1",
      "tasks": [
        { "id": "w1-t1", "title": "Initialize Vite project", "completed": false }
      ]
    }
    // ... 9 weeks total
  ],
  "daily": [
    { "id": "d1", "title": "Write 50 lines of React code", "completed": false }
  ],
  "isMock": false
}
```

---

##  LocalStorage Keys

| Key | Purpose |
|-----|---------|
| `goal_os_roadmap` | Full roadmap data + checkbox state |
| `goal_os_start_date` | Goal start date for calendar |
| `goal_os_streak` | Daily habit completion log (per-date) |

---

## Screenshots

*(Add your UI screenshots here)*

---

## Demo

*(Add demo video link here)*

---

##  How Duration Parsing Works

GoalOS automatically extracts the correct number of weeks from any goal string:

| Goal String | Parsed As |
|-------------|-----------|
| "Learn React in 60 days" | 9 weeks |
| "Run a marathon in 3 months" | 12 weeks |
| "Build a SaaS in 6 weeks" | 6 weeks |
| "Master Python" *(no duration)* | 4 weeks (default) |

The AI is explicitly prompted to return **exactly that many weeks** of content. If the AI returns the wrong count, the system automatically falls back to the local generator.

---

##  Hackathon Highlights

* Dynamic AI roadmap scaled to actual goal duration
* Full offline fallback — works 100% without API key
* Calendar + streak system for real accountability
* One-click PDF export with professional layout
* Clean separation of frontend & backend
* Confetti celebration system on milestones

---

##  Future Improvements

* User authentication & cloud sync
* Deadline prediction based on current velocity
* Mobile app (React Native)
* Share roadmap via public link
* AI-powered weekly check-ins and re-planning

---

##  Author

Puneesh Diwakar

---

##  Conclusion

GoalOS AI turns any goal into a fully structured execution plan. With dynamic duration support, daily streak tracking, a goal calendar, and PDF export — it bridges the gap between planning and real-world accountability.