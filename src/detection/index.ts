import * as chrono from "chrono-node";
import { PATTERNS } from "./patterns";
import { ContentResult } from "./types";

export async function detectContent(text: string): Promise<ContentResult> {
  const trimmed = text.trim();
  const wordCount = trimmed.split(/\s+/).length;
  const charCount = trimmed.length;

  // Check URL first (high confidence)
  if (PATTERNS.url.test(trimmed)) {
    return {
      type: "url",
      confidence: 1.0,
      entities: { url: trimmed.match(PATTERNS.url)?.[0] },
    };
  }

  // Check JSON
  if (isValidJSON(trimmed)) {
    return {
      type: "json",
      confidence: 1.0,
      entities: {},
    };
  }

  // Check for dates/meetings
  const dateResults = chrono.parse(trimmed);
  if (dateResults.length > 0) {
    const date = dateResults[0];
    return {
      type: "meeting",
      confidence: 0.9,
      entities: {
        date: date.start.date(),
        dateText: date.text,
        location: extractLocation(trimmed),
      },
    };
  }

  // Check address
  if (PATTERNS.address.test(trimmed)) {
    return {
      type: "address",
      confidence: 0.8,
      entities: { address: trimmed },
    };
  }

  // Categorize by length
  if (wordCount <= 2 && charCount < 30) {
    return {
      type: "word",
      confidence: 0.9,
      entities: {},
    };
  }

  if (charCount < 100) {
    return {
      type: "short",
      confidence: 0.9,
      entities: {},
    };
  }

  return {
    type: "long",
    confidence: 0.9,
    entities: {},
  };
}

function isValidJSON(text: string): boolean {
  if (!text.startsWith("{") && !text.startsWith("[")) return false;
  try {
    JSON.parse(text);
    return true;
  } catch {
    return false;
  }
}

function extractLocation(text: string): string | undefined {
  // Look for "at [Location]" or "in [Location]"
  // Capture everything after "at/in" until we hit a time indicator or end
  const match = text.match(
    /(?:at|in)\s+(?:the\s+)?([^,.\n]+?)(?:\s+(?:at|on|tomorrow|today|next|this|\d{1,2}(?::\d{2})?\s*(?:am|pm)?)|$)/i,
  );
  return match?.[1]?.trim();
}
