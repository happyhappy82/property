/**
 * Convert a date string (YYYY-MM-DD) to full ISO 8601 timestamp with KST timezone
 * @param dateString - Date in YYYY-MM-DD format
 * @returns Full ISO 8601 timestamp (e.g., "2026-01-11T00:00:00+09:00")
 */
export function toISOTimestamp(dateString: string): string {
  // If already a full timestamp, return as is
  if (dateString.includes("T")) {
    return dateString;
  }

  // Convert YYYY-MM-DD to full ISO 8601 with KST timezone
  return `${dateString}T00:00:00+09:00`;
}

/**
 * Format a date string for display (YYYY-MM-DD)
 * @param dateString - Date string (can be full ISO or YYYY-MM-DD)
 * @returns Date in YYYY-MM-DD format for display
 */
export function formatDisplayDate(dateString: string): string {
  // If it's a full timestamp, extract just the date part
  if (dateString.includes("T")) {
    return dateString.split("T")[0];
  }
  return dateString;
}
