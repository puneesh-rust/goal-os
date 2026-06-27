import axios from 'axios';
import * as roadmapService from './roadmapService.js';
// OR: import { generateRoadmap as generateLocalRoadmap } from './roadmapService.js';

// ─── Duration Extractor ────────────────────────────────────────────────────────
const extractDuration = (goal) => {
  const daysMatch   = goal.match(/(\d+)\s*day/i);
  const weeksMatch  = goal.match(/(\d+)\s*week/i);
  const monthsMatch = goal.match(/(\d+)\s*month/i);

  if (daysMatch)   return `${Math.ceil(parseInt(daysMatch[1]) / 7)} Weeks`;
  if (weeksMatch)  return `${weeksMatch[1]} Weeks`;
  if (monthsMatch) return `${parseInt(monthsMatch[1]) * 4} Weeks`;
  return "4 Weeks";
};

const extractTotalWeeks = (goal) => {
  const daysMatch   = goal.match(/(\d+)\s*day/i);
  const weeksMatch  = goal.match(/(\d+)\s*week/i);
  const monthsMatch = goal.match(/(\d+)\s*month/i);

  if (daysMatch)   return Math.ceil(parseInt(daysMatch[1]) / 7);
  if (weeksMatch)  return parseInt(weeksMatch[1]);
  if (monthsMatch) return parseInt(monthsMatch[1]) * 4;
  return 4;
};

// ─── Main Export ───────────────────────────────────────────────────────────────
// ─── Main Export ───────────────────────────────────────────────────────────────
export const createRoadmap = async (goal) => {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey || apiKey.trim().length < 10) {
    console.warn("No valid OPENROUTER_API_KEY → using local fallback");
    return {
      goal,
      ...roadmapService.createRoadmap(goal),
      isMock: true
    };
  }

  const totalWeeks    = extractTotalWeeks(goal);
  const estimatedTime = extractDuration(goal);

  const prompt = `You are a structured JSON roadmap generator for the goal: "${goal}".
Generate a roadmap with exactly ${totalWeeks} weeks of content. Return ONLY valid JSON with this structure:
{
  "monthly": [
    { "title": "Month 1 Focus", "description": "Description of month 1" }
  ],
  "weekly": [
    { "id": "w1", "title": "Week 1: Title", "description": "Description", "duration": "Week 1", "tasks": [{ "id": "w1-t1", "title": "Task 1", "completed": false }] }
  ],
  "daily": [
    { "id": "d1", "title": "Daily task 1", "completed": false }
  ]
}`;

  try {
    console.log("Calling OpenRouter API with goal:", goal);
    
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-4o-mini", // Changed from gpt-3.5-turbo-0125
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 2000
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:5000",
          "X-Title": "GoalOS"
        },
        timeout: 30000
      }
    );

    // Log success
    console.log("OpenRouter API call successful");

    const text = response.data.choices[0].message.content;
    console.log("AI Response length:", text.length);

    const cleaned = text.replace(/```json|```/gi, "").trim();
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error("No JSON found in AI response");
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // Validate the response
    if (!Array.isArray(parsed.weekly) || parsed.weekly.length !== totalWeeks) {
      throw new Error(`Week count mismatch: expected ${totalWeeks}, got ${parsed.weekly?.length || 0}`);
    }

    return {
      goal,
      category: "AI Generated",
      difficulty: "Medium",
      estimatedTime,
      monthly: parsed.monthly || [],
      weekly: parsed.weekly || [],
      daily: parsed.daily || [],
      isMock: false
    };

  } catch (err) {
    console.error("OpenRouter failed → fallback:", err.message);
    
    // Log more details about the error
    if (err.response) {
      console.error("Response status:", err.response.status);
      console.error("Response data:", err.response.data);
    }

    const fallback = roadmapService.createRoadmap(goal);
    return {
      ...fallback,
      category: "Fallback Blueprint",
      isMock: true
    };
  }
};