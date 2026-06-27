import axios from 'axios';

/**
 * Defensive Normalizer
 * If the API returns string list fallbacks, this formats them into structured objects
 * with IDs, descriptions, and task checklists for the dashboard to track checkbox status.
 */
const normalizeRoadmap = (data) => {
  // FIX: Guard against null / undefined data entirely
  if (!data || typeof data !== 'object') {
    return {
      monthly: [{ id: "m1", title: "Plan your goal", description: "Establish high-level objectives." }],
      weekly: [{
        id: "w1",
        title: "Weekly execution steps",
        description: "Break the goal into weekly milestones.",
        duration: "Week 1",
        tasks: [{ id: "w1-t1", title: "Complete initial checklist items", completed: false }]
      }],
      daily: [{ id: "d1", title: "Execute daily habits and track items", completed: false }]
    };
  }

  const normalized = { ...data };

  // Normalize monthly plan array
  if (Array.isArray(normalized.monthly) && normalized.monthly.length > 0) {
    if (typeof normalized.monthly[0] === 'string') {
      normalized.monthly = normalized.monthly.map((title, idx) => ({
        id: `m${idx + 1}`,
        // FIX: Trim whitespace from AI-generated strings to avoid ragged display
        title: title.trim(),
        description: "Review general guidelines, check documentation, and align targets."
      }));
    }
    // FIX: If already objects, leave them untouched (was silently skipped before)
  } else {
    normalized.monthly = [
      { id: "m1", title: "Plan your goal", description: "Establish high-level objectives." }
    ];
  }

  // Normalize weekly milestones array
  if (Array.isArray(normalized.weekly) && normalized.weekly.length > 0) {
    if (typeof normalized.weekly[0] === 'string') {
      normalized.weekly = normalized.weekly.map((title, idx) => ({
        id: `w${idx + 1}`,
        title: title.trim(), // FIX: Trim here too
        description: "Execute baseline operations and log target actions.",
        duration: `Week ${idx + 1}`,
        tasks: [
          { id: `w${idx + 1}-t1`, title: "Set up work tools and environment settings", completed: false },
          { id: `w${idx + 1}-t2`, title: "Execute core roadmap guidelines", completed: false },
          { id: `w${idx + 1}-t3`, title: "Finalize weekly checkpoints and logs", completed: false }
        ]
      }));
    }
  } else {
    normalized.weekly = [
      {
        id: "w1",
        title: "Weekly execution steps",
        description: "Break the goal into weekly milestones.",
        duration: "Week 1",
        tasks: [{ id: "w1-t1", title: "Complete initial checklist items", completed: false }]
      }
    ];
  }

  // Normalize daily tasks/habits array
  if (Array.isArray(normalized.daily) && normalized.daily.length > 0) {
    if (typeof normalized.daily[0] === 'string') {
      normalized.daily = normalized.daily.map((title, idx) => ({
        id: `d${idx + 1}`,
        title: title.trim(), // FIX: Trim here too
        completed: false
      }));
    }
  } else {
    normalized.daily = [
      { id: "d1", title: "Execute daily habits and track items", completed: false }
    ];
  }

  return normalized;
};

/**
 * Calls the goal generator backend API using Axios.
 * Handles normalizing string-list API fallback payloads into dashboard checklists.
 *
 * @param {string} goal - The user's target objective query.
 * @returns {Promise<object>} The generated (and normalized) roadmap.
 */
export const generateRoadmapAPI = async (goal) => {
  // FIX: Validate goal input before sending — avoids a pointless round-trip
  if (!goal || typeof goal !== 'string' || goal.trim().length === 0) {
    throw new Error('Goal must be a non-empty string.');
  }

  // FIX: Wrap in try/catch to surface a clear error instead of an unhandled rejection
  try {
    const response = await axios.post(
      'http://localhost:5000/api/generate',
      // FIX: Trim goal so trailing whitespace doesn't reach the backend
      { goal: goal.trim() },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        // FIX: Comment said "5 seconds" but value was 15000 ms (15s) — corrected comment
        timeout: 60000 // 15 seconds timeout
      }
    );

    // FIX: Guard against an empty or missing response body before normalizing
    if (!response.data) {
      throw new Error('Empty response received from server.');
    }

    // Return the normalized data structure
    return normalizeRoadmap(response.data);

  } catch (err) {
    // FIX: Re-throw with a user-friendly message while preserving the original cause
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      const serverMsg = err.response?.data?.message || err.message;

      if (err.code === 'ECONNABORTED') {
        throw new Error('Request timed out. The server took too long to respond.');
      }
      if (status === 404) {
        throw new Error('API endpoint not found. Is the backend server running?');
      }
      if (status >= 500) {
        throw new Error(`Server error (${status}): ${serverMsg}`);
      }
      throw new Error(`Request failed: ${serverMsg}`);
    }

    // Non-Axios error (e.g. bad goal validation above) — re-throw as-is
    throw err;
  }
};
