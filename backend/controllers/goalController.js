import { createRoadmap } from '../services/aiService.js';

/**
 * Handles goal generation request and returns the structured roadmap.
 * Expects JSON body with: { goal: "string" }
 */
export const generateRoadmap = async (req, res) => {
  const { goal } = req.body;

  // Input validation
  if (!goal || typeof goal !== 'string' || !goal.trim()) {
    return res.status(400).json({
      error: 'Invalid Request',
      message: 'A non-empty string parameter "goal" is required in request body.'
    });
  }

  try {
    // AI service call - FIXED: Use createRoadmap directly
    const generatedRoadmap = await createRoadmap(goal.trim());
    res.json(generatedRoadmap);
  } catch (error) {
    console.error('AI Generation failed. Returning fallback response. Error:', error.message);

    // Fallback response
    const fallbackResponse = {
      monthly: ["Plan your goal"],
      weekly: ["Break into steps"],
      daily: ["Start working"],
      goal: goal.trim(),
      category: "Fallback Blueprint",
      difficulty: "Medium",
      estimatedTime: "4 Weeks",
      isFallback: true
    };

    res.json(fallbackResponse);
  }
};
