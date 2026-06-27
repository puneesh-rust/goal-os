/**
 * Roadmap Service (Backend)
 * Dynamically generates structured roadmap items based on goal keywords AND duration.
 * "Learn React in 60 days" → 9 weeks of content, not hardcoded 4.
 */

// ─── Duration Extractor ────────────────────────────────────────────────────────
const extractDuration = (normalizedGoal) => {
  const daysMatch   = normalizedGoal.match(/(\d+)\s*day/i);
  const weeksMatch  = normalizedGoal.match(/(\d+)\s*week/i);
  const monthsMatch = normalizedGoal.match(/(\d+)\s*month/i);

  if (daysMatch)   return { totalWeeks: Math.ceil(parseInt(daysMatch[1]) / 7),    estimatedTime: `${Math.ceil(parseInt(daysMatch[1]) / 7)} Weeks` };
  if (weeksMatch)  return { totalWeeks: parseInt(weeksMatch[1]),                   estimatedTime: `${weeksMatch[1]} Weeks` };
  if (monthsMatch) return { totalWeeks: parseInt(monthsMatch[1]) * 4,             estimatedTime: `${parseInt(monthsMatch[1]) * 4} Weeks` };

  return { totalWeeks: 4, estimatedTime: "4 Weeks" };
};

// ─── Weekly Plan Generators ────────────────────────────────────────────────────
// Each generator cycles through phases[] so it works for ANY number of weeks.

const generateReactWeeks = (totalWeeks) => {
  const phases = [
    {
      title: "React & JSX Core Setup",
      description: "Initialize Vite workspace, learn JSX binding styles, and configure props/state.",
      tasks: [
        "Initialize the project using Vite and install React Router + Axios",
        "Design the visual token structure and base CSS theme components",
        "Build static functional components with props mapping",
        "Implement state variables with standard useState hooks"
      ]
    },
    {
      title: "Side Effects & Hooks Integration",
      description: "Incorporate useEffect logic, manage cleanups, and write reusable custom hooks.",
      tasks: [
        "Integrate useEffect triggers and configure dependency arrays",
        "Implement event listeners and cleanups in hooks",
        "Extract fetch parameters into a reusable custom hook"
      ]
    },
    {
      title: "Router Configurations & Forms",
      description: "Connect page routing, configure path parameters, and wire inputs.",
      tasks: [
        "Build router routes using react-router-dom Router components",
        "Design validated inputs and form handlers",
        "Manage dynamic search configurations"
      ]
    },
    {
      title: "Axios Requests & API Integration",
      description: "Execute API operations, handle errors, and display data.",
      tasks: [
        "Perform GET and POST operations with Axios instance config",
        "Implement loading progress bars and catch request errors",
        "Display API data in components with proper error boundaries"
      ]
    },
    {
      title: "State Management & Context",
      description: "Manage global state using Context API or Redux Toolkit.",
      tasks: [
        "Set up React Context for shared application state",
        "Implement useReducer for complex state transitions",
        "Migrate local state to global store where needed"
      ]
    },
    {
      title: "Testing & Code Quality",
      description: "Write unit and integration tests, enforce linting rules.",
      tasks: [
        "Write unit tests for core components using React Testing Library",
        "Set up ESLint and Prettier with project-specific rules",
        "Achieve at least 70% test coverage on critical components"
      ]
    },
    {
      title: "Performance Optimization",
      description: "Audit bundle size, lazy load routes, and memoize expensive renders.",
      tasks: [
        "Implement React.lazy and Suspense for route-level code splitting",
        "Use useMemo and useCallback to eliminate unnecessary re-renders",
        "Audit Lighthouse score and fix top 3 performance bottlenecks"
      ]
    },
    {
      title: "Deployment & Production Readiness",
      description: "Run final build, configure env variables, and deploy.",
      tasks: [
        "Configure .env files for development and production environments",
        "Run npm build and verify output bundle sizes",
        "Deploy to Vercel or Netlify and validate production URL"
      ]
    }
  ];

  return Array.from({ length: totalWeeks }, (_, i) => {
    const phase = phases[i % phases.length];
    return {
      id: `w${i + 1}`,
      title: `Week ${i + 1}: ${phase.title}`,
      description: phase.description,
      duration: `Week ${i + 1}`,
      tasks: phase.tasks.map((title, ti) => ({
        id: `w${i + 1}-t${ti + 1}`,
        title,
        completed: false
      }))
    };
  });
};

const generateFitnessWeeks = (totalWeeks) => {
  const phases = [
    {
      title: "Running Volume Baseline",
      description: "Establish training frequency and determine comfortable conversational pace.",
      tasks: [
        "Complete 3 easy conversational runs of 4km each",
        "Perform dynamic warm-ups and cool down stretching routines",
        "Identify target running route loops around the neighborhood"
      ]
    },
    {
      title: "Cardio Strength Intervals",
      description: "Introduce hills and interval sessions to expand lung capacity.",
      tasks: [
        "Execute 1 interval session (5x 400m strides with rest)",
        "Perform lower body core workout (squats, calf raises, planks)",
        "Complete weekend long run of 6km at easy pace"
      ]
    },
    {
      title: "Nutrition & Hydration Review",
      description: "Audit pre-workout meal contents and practice hydration during training.",
      tasks: [
        "Practice drinking water during easy running trials",
        "Incorporate high-carb, low-fiber meals 2 hours before runs",
        "Complete a mid-week speed running session"
      ]
    },
    {
      title: "Volume Peak",
      description: "Reach peak distance volume before scheduled recovery drop.",
      tasks: [
        "Run a peak distance of 8km at target event pace",
        "Complete 2 strength recovery cross-training sessions (swimming/cycling)",
        "Audit running shoe tread wear and confirm stability profile"
      ]
    },
    {
      title: "Recovery & Adaptation",
      description: "Allow body to absorb training load and consolidate gains.",
      tasks: [
        "Reduce weekly mileage by 30% for active recovery",
        "Focus on sleep quality — target 8 hours per night",
        "Perform foam rolling and mobility sessions daily"
      ]
    },
    {
      title: "Speed & Race Pace Work",
      description: "Introduce race-specific pace sessions and tempo runs.",
      tasks: [
        "Complete 2 tempo runs at goal race pace this week",
        "Execute 1 fartlek session — mix slow and fast efforts",
        "Practice race-day nutrition timing in a long run"
      ]
    },
    {
      title: "Taper & Race Prep",
      description: "Reduce volume, sharpen form, and prepare mentally for race day.",
      tasks: [
        "Cut total mileage to 50% of peak week volume",
        "Run 2 short shakeout runs at easy effort",
        "Lay out race kit, plan nutrition, and confirm event logistics"
      ]
    },
    {
      title: "Race Week & Reflection",
      description: "Execute the event and review overall training cycle.",
      tasks: [
        "Complete the race or goal event at full effort",
        "Log race results and compare against target pace",
        "Plan next training cycle based on lessons learned"
      ]
    }
  ];

  return Array.from({ length: totalWeeks }, (_, i) => {
    const phase = phases[i % phases.length];
    return {
      id: `w${i + 1}`,
      title: `Week ${i + 1}: ${phase.title}`,
      description: phase.description,
      duration: `Week ${i + 1}`,
      tasks: phase.tasks.map((title, ti) => ({
        id: `w${i + 1}-t${ti + 1}`,
        title,
        completed: false
      }))
    };
  });
};

const generateStartupWeeks = (totalWeeks) => {
  const phases = [
    {
      title: "Problem Definition & Surveys",
      description: "Identify user pain points, define target profiles, and build survey campaigns.",
      tasks: [
        "Create a list of 15 target users for user feedback loops",
        "Design a survey questionnaire focusing on problem validation",
        "Deploy survey link and collect at least 10 responses"
      ]
    },
    {
      title: "Landing Page & Waitlist Scaffold",
      description: "Construct a modern visual showcase containing clear call-to-actions.",
      tasks: [
        "Setup responsive HTML/Vite landing page layout",
        "Write copy outlining benefits and the primary value proposition",
        "Connect sign-up forms to database hooks (e.g. Mailchimp/Firebase)"
      ]
    },
    {
      title: "MVP Scoping & Data Schemas",
      description: "Draft strict minimal features list and define backend layouts.",
      tasks: [
        "Map user action flows from login to core dashboard",
        "Prune feature wishlist down to the single most critical value feature",
        "Create database tables or document structures schema layouts"
      ]
    },
    {
      title: "Authentication & Core Dashboard",
      description: "Configure registration flows and basic dashboard page parameters.",
      tasks: [
        "Wire signup and login pages with auth token models",
        "Construct the primary interactive grid layouts",
        "Integrate payment setup configuration toggles"
      ]
    },
    {
      title: "Core Feature Build",
      description: "Implement the primary value-delivering feature of the MVP.",
      tasks: [
        "Build the main product feature end-to-end (frontend + backend)",
        "Connect feature to the database and verify data persistence",
        "Internal dog-fooding — use the product daily and log issues"
      ]
    },
    {
      title: "Beta Launch & Feedback Loop",
      description: "Open access to early users and run structured feedback sessions.",
      tasks: [
        "Invite 10 beta users and onboard them with a walkthrough",
        "Set up error tracking (Sentry) and usage analytics (PostHog)",
        "Conduct 5 user interviews and synthesize top 3 friction points"
      ]
    },
    {
      title: "Iteration & Bug Fixes",
      description: "Act on beta feedback and stabilize the product.",
      tasks: [
        "Fix top 5 bugs reported by beta users",
        "Ship 1 high-impact improvement based on feedback",
        "Update onboarding flow to reduce time-to-value"
      ]
    },
    {
      title: "Growth & Monetization",
      description: "Launch pricing, drive traffic, and convert free users.",
      tasks: [
        "Publish pricing page and enable Stripe checkout",
        "Post launch on Product Hunt, Hacker News, or relevant communities",
        "Track week-1 MRR and set next milestone target"
      ]
    }
  ];

  return Array.from({ length: totalWeeks }, (_, i) => {
    const phase = phases[i % phases.length];
    return {
      id: `w${i + 1}`,
      title: `Week ${i + 1}: ${phase.title}`,
      description: phase.description,
      duration: `Week ${i + 1}`,
      tasks: phase.tasks.map((title, ti) => ({
        id: `w${i + 1}-t${ti + 1}`,
        title,
        completed: false
      }))
    };
  });
};

const generateGenericWeeks = (totalWeeks, goal) => {
  const phases = [
    {
      title: "Research, Strategy & Audit",
      description: `Audit baseline requirements, study existing patterns, and schedule blocks for: "${goal}".`,
      tasks: [
        `Search for guides, case studies, and tutorials regarding ${goal}`,
        "Identify resources, dependencies, and potential blockers",
        "Carve out a dedicated daily practice time block in schedule"
      ]
    },
    {
      title: "Scaffolding & Initial Action",
      description: "Establish baseline working models, set up tools, and complete early tasks.",
      tasks: [
        "Initialize the working folders, draft layout templates, or tool setup",
        "Complete the first actionable milestone task in sequence",
        "Document initial challenges and adjust difficulty pace"
      ]
    },
    {
      title: "Deep Execution & Integration",
      description: "Iterate on complexity, solve hard blocks, and build main structural sections.",
      tasks: [
        "Complete complex tasks and integrate subcomponents",
        "Review progress against goals and solicit peer feedback",
        "Implement optimizations and cleanups"
      ]
    },
    {
      title: "Review & Course Correction",
      description: "Measure output against targets and pivot approach where needed.",
      tasks: [
        "Compare completed work against the original goal specification",
        "Identify the top 2 gaps and create targeted action plans",
        "Adjust timeline estimates based on actual velocity"
      ]
    },
    {
      title: "Advanced Execution",
      description: "Push into harder or more nuanced aspects of the goal.",
      tasks: [
        "Tackle the most challenging remaining task head-on",
        "Seek expert review or mentor feedback on your work",
        "Document learnings and update your working notes"
      ]
    },
    {
      title: "Integration & Stress Testing",
      description: "Combine all components and validate the full pipeline end-to-end.",
      tasks: [
        "Run a full end-to-end walkthrough of everything built so far",
        "Identify and fix the top 3 integration failures",
        "Get a second pair of eyes on the overall output"
      ]
    },
    {
      title: "Polish & Refinement",
      description: "Elevate quality, fix edge cases, and prepare for final review.",
      tasks: [
        "Fix all known bugs or gaps identified in previous weeks",
        "Polish presentation, documentation, or user-facing details",
        "Conduct a personal quality audit against the goal criteria"
      ]
    },
    {
      title: "Finalizing & Launch Review",
      description: "Audit final output quality, execute test routines, and verify goal success.",
      tasks: [
        `Double check final details and fix errors relating to: ${goal}`,
        "Conduct a comprehensive review and check success parameters",
        "Publish, deploy, or declare the objective officially completed!"
      ]
    }
  ];

  return Array.from({ length: totalWeeks }, (_, i) => {
    const phase = phases[i % phases.length];
    return {
      id: `w${i + 1}`,
      title: `Week ${i + 1}: ${phase.title}`,
      description: phase.description,
      duration: `Week ${i + 1}`,
      tasks: phase.tasks.map((title, ti) => ({
        id: `w${i + 1}-t${ti + 1}`,
        title,
        completed: false
      }))
    };
  });
};

// ─── Monthly Plan Generator ────────────────────────────────────────────────────
// Generates one milestone per 4-week block — so 9 weeks → 3 monthly milestones.

const generateMonthlyPlan = (totalWeeks, category, goal) => {
  const totalMonths = Math.ceil(totalWeeks / 4);

  const focusMap = {
    "Frontend Development": [
      { title: "React Framework Mastery & Project Scaffold", desc: "Build core component architectures, implement client-side routing, and query REST endpoints." },
      { title: "Hooks, State Management & Testing",          desc: "Master useEffect, Context API, and write a solid test suite for your components." },
      { title: "Performance, Optimization & Deployment",     desc: "Audit bundle size, add lazy loading, and ship the production build to hosting." }
    ],
    "Fitness & Athletics": [
      { title: "Aerobic Base & Endurance Foundation", desc: "Increase mileage gradually, establish nutrition plan, and practice pacing." },
      { title: "Speed Work & Race Simulation",        desc: "Introduce tempo runs, interval sessions, and practice race-day nutrition timing." },
      { title: "Taper, Race Execution & Recovery",    desc: "Reduce volume, sharpen form, execute the event, and plan the next cycle." }
    ],
    "Entrepreneurship": [
      { title: "MVP Launch & Market Validation",   desc: "Conduct user validation surveys, deploy a landing page, and connect a waitlist." },
      { title: "Core Feature Build & Beta Launch", desc: "Ship the primary value feature, onboard beta users, and collect structured feedback." },
      { title: "Growth, Monetization & Iteration", desc: "Launch pricing, drive traffic, and iterate rapidly on user feedback." }
    ]
  };

  const fallback = [
    { title: "Research, Strategy & Foundation", desc: `Audit requirements, gather resources, and lay the groundwork for: "${goal}".` },
    { title: "Deep Execution & Integration",     desc: "Tackle the hardest tasks, integrate components, and resolve blockers." },
    { title: "Polish, Review & Completion",      desc: "Finalize output, fix remaining gaps, and declare the goal achieved." }
  ];

  const focusList = focusMap[category] || fallback;

  return Array.from({ length: totalMonths }, (_, i) => {
    const focus     = focusList[i % focusList.length];
    const startWeek = i * 4 + 1;
    const endWeek   = Math.min((i + 1) * 4, totalWeeks);
    return {
      id:          `m${i + 1}`,
      title:       `Month ${i + 1} Focus: ${focus.title}`,
      description: `${focus.desc} (Weeks ${startWeek}–${endWeek})`
    };
  });
};

// ─── Main Export ───────────────────────────────────────────────────────────────
export const createRoadmap = (goal) => {
  if (!goal || typeof goal !== 'string' || goal.trim().length === 0) {
    throw new Error('Goal must be a non-empty string.');
  }

  const trimmedGoal    = goal.trim();
  const normalizedGoal = trimmedGoal.toLowerCase();

  const { totalWeeks, estimatedTime } = extractDuration(normalizedGoal);

  let category   = "Personal Development";
  let difficulty = totalWeeks > 12 ? "Hard" : totalWeeks <= 4 ? "Easy" : "Medium";
  let weekly     = [];
  let daily      = [];

  if (normalizedGoal.includes('react') || normalizedGoal.includes('frontend') || normalizedGoal.includes('web')) {
    category   = "Frontend Development";
    difficulty = "Intermediate";
    weekly     = generateReactWeeks(totalWeeks);
    daily      = [
      { id: "d1", title: "Write at least 50 lines of functional React code", completed: false },
      { id: "d2", title: "Review developer logs and fix console warnings", completed: false },
      { id: "d3", title: "Read 1 React documentation section on hooks/patterns", completed: false }
    ];

  } else if (normalizedGoal.includes('startup') || normalizedGoal.includes('saas') || normalizedGoal.includes('business')) {
    category   = "Entrepreneurship";
    difficulty = "Expert";
    weekly     = generateStartupWeeks(totalWeeks);
    daily      = [
      { id: "d1", title: "Reach out to 2 potential partners or early adopters", completed: false },
      { id: "d2", title: "Post 1 update or snippet on social/developer channels", completed: false },
      { id: "d3", title: "Test 1 interactive flow of the MVP dashboard", completed: false }
    ];

  } else if (normalizedGoal.includes('run') || normalizedGoal.includes('marathon') || normalizedGoal.includes('fitness')) {
    category   = "Fitness & Athletics";
    difficulty = "Hard";
    weekly     = generateFitnessWeeks(totalWeeks);
    daily      = [
      { id: "d1", title: "Drink at least 3 liters of water for hydration", completed: false },
      { id: "d2", title: "Perform 10 minutes of hip mobility and ankle stretches", completed: false },
      { id: "d3", title: "Maintain a protein-balanced breakfast profile", completed: false }
    ];

  } else {
    weekly = generateGenericWeeks(totalWeeks, trimmedGoal);
    daily  = [
      { id: "d1", title: "Dedicate 45 minutes of focused effort to goal tasks", completed: false },
      { id: "d2", title: "Complete a daily standup log of what was done", completed: false },
      { id: "d3", title: "Review tomorrow's plan and clear blocks", completed: false }
    ];
  }

  const monthly = generateMonthlyPlan(totalWeeks, category, trimmedGoal);

  return {
    goal: trimmedGoal,
    category,
    difficulty,
    estimatedTime,
    monthly,
    weekly,
    daily
  };
};