/**
 * Shared date utilities
 */

/**
 * Returns the number of calendar days until a given date string.
 * Returns null if no date is provided.
 * Returns 0 if the date is today or in the past (clamped, never negative).
 *
 * @param {string|null|undefined} dateStr — ISO date string e.g. "2026-05-15"
 * @returns {number|null}
 */
export function daysUntil(dateStr) {
  if (!dateStr) return null;
  const target = new Date(dateStr);
  const today  = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
  return Math.max(0, diff);
}

/**
 * Formats a date string as a short locale string.
 * @param {string} dateStr
 * @param {"en-CA"|string} [locale]
 * @returns {string}
 */
export function formatDate(dateStr, locale = "en-CA") {
  return new Date(dateStr).toLocaleDateString(locale, {
    month: "short",
    day:   "numeric",
    year:  "numeric",
  });
}
