/**
 * Calculates goal delay based on missed days.
 * Rule: Each missed day adds 2 days of delay.
 * 
 * @param {number} missedDays - Count of missed days or incomplete tasks.
 * @returns {object} Object containing the delay message string.
 */
export const calculateDelay = (missedDays) => {
  const days = Math.max(0, Math.round(Number(missedDays) || 0));
  const delayAmount = days * 2;
  
  return {
    delayMessage: `Missing today's task delays your goal by ${delayAmount} days`
  };
};
