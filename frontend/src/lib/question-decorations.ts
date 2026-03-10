import type { StepDirective } from "@/components/practice/explanation-viewer";
import type { SessionQuestion } from "@/types/session";

type DecorationRecord = {
  target?: string;
  action?: string;
  text?: string;
  choice_id?: string | number;
};

export function getQuestionDecorations(
  question?: Pick<SessionQuestion, "metadata"> | null
): StepDirective[] {
  const metadata = parseMetadata(question?.metadata);
  if (!metadata) {
    return [];
  }
  const decorations = parseDecorations(metadata["decorations"]);
  if (!decorations.length) {
    return [];
  }
  return decorations
    .map((entry) => normalizeDecoration(entry))
    .filter((entry): entry is StepDirective => Boolean(entry));
}

function normalizeDecoration(entry: unknown): StepDirective | null {
  if (!entry || typeof entry !== "object") {
    return null;
  }
  const record = entry as DecorationRecord;
  const text = typeof record.text === "string" ? record.text.trim() : "";
  if (!text) {
    return null;
  }
  const target = normalizeTarget(record.target);
  const action = normalizeAction(record.action);
  return {
    target,
    text,
    action,
  };
}

function parseMetadata(raw: unknown): Record<string, unknown> | null {
  if (!raw) return null;
  if (typeof raw === "object") return raw as Record<string, unknown>;
  if (typeof raw !== "string") return null;
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

function parseDecorations(raw: unknown): unknown[] {
  if (Array.isArray(raw)) return raw;
  if (typeof raw !== "string") return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function normalizeTarget(raw: unknown): StepDirective["target"] {
  const value = typeof raw === "string" ? raw.trim().toLowerCase() : "";
  if (value === "stem" || value === "choices" || value === "figure") {
    return value;
  }
  return "passage";
}

function normalizeAction(raw: unknown): StepDirective["action"] {
  const value = typeof raw === "string" ? raw.trim().toLowerCase() : "";
  if (
    value === "highlight" ||
    value === "underline" ||
    value === "circle" ||
    value === "strike" ||
    value === "note" ||
    value === "color" ||
    value === "font"
  ) {
    return value;
  }
  return "underline";
}

