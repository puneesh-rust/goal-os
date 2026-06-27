/**
 * Delay Service
 * Computes estimated roadmap delays based on missed daily tasks.
 */

/**
 * Calculates goal delay based on missed days.
 * Rule: Each missed day adds 2 days of delay.
 * 
 * @param {number} missedDays
 * @returns {object}
 */
export const calculateDelay = (missedDays) => {
  const days = Math.max(0, Math.round(Number(missedDays) || 0));
  const delayAmount = days * 2;

  return {
    delayMessage: `Missing today's task delays your goal by ${delayAmount} days`
  };
};
