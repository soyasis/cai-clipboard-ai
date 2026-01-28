import { open, showToast, Toast } from "@raycast/api";
import { ContentResult } from "../detection/types";

/**
 * Create a calendar event
 */
export async function createCalendarEvent(text: string, detection: ContentResult): Promise<void> {
  const { date, location } = detection.entities;

  if (!date) {
    await showToast({
      style: Toast.Style.Failure,
      title: "No date detected",
    });
    return;
  }

  // Extract a title from the text
  const title = extractEventTitle(text) || "Event";

  // Use Google Calendar for better pre-filling support
  const gcalUrl = buildGoogleCalendarUrl(title, date, location);
  await open(gcalUrl);

  await showToast({
    style: Toast.Style.Success,
    title: "Opening Calendar",
    message: title,
  });
}

function extractEventTitle(text: string): string | undefined {
  // Try common patterns
  const patterns = [
    /(?:meeting|call|sync|chat)\s+(?:about|re:?|for|on)\s+(.+?)(?:\s+(?:on|at|tomorrow|next))/i,
    /(?:let's|lets)\s+(?:sync|meet|chat|discuss)\s+(?:about|on|re:?)?\s*(.+?)(?:\s+(?:on|at|tomorrow))/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[1].trim().slice(0, 50);
  }

  // Fallback: use first few words
  const words = text.split(/\s+/).slice(0, 5).join(" ");
  return words.length > 50 ? words.slice(0, 47) + "..." : words;
}

function buildGoogleCalendarUrl(title: string, date: Date, location?: string): string {
  const formatDate = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const endDate = new Date(date.getTime() + 60 * 60 * 1000); // +1 hour

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${formatDate(date)}/${formatDate(endDate)}`,
  });

  if (location) params.set("location", location);

  return `https://calendar.google.com/calendar/render?${params}`;
}
