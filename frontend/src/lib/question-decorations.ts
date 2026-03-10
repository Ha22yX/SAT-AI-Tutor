import type { StepDirective } from "@/components/practice/explanation-viewer";
import type { SessionQuestion } from "@/types/session";

type DecorationRecord = {
  target?: string;
  action?: string;
  text?: string;
  choice_id?: string | number;
};

export function getQuestionDecorations(
  question?: Pick<SessionQuestion, "metadata" | "passage"> | null
): StepDirective[] {
  const sources: unknown[] = [];
  if (question?.metadata && typeof question.metadata === "object") {
    sources.push((question.metadata as Record<string, unknown>)["decorations"]);
  }
  const passageMeta = question?.passage?.metadata;
  if (passageMeta && typeof passageMeta === "object") {
    sources.push((passageMeta as Record<string, unknown>)["decorations"]);
  }
  return sources
    .flatMap((decorations) => (Array.isArray(decorations) ? decorations : []))
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
  const rawTarget =
    typeof record.target === "string" ? record.target.trim().toLowerCase() : "";
  const target: StepDirective["target"] =
    rawTarget === "passage" ||
    rawTarget === "stem" ||
    rawTarget === "choices" ||
    rawTarget === "figure"
      ? rawTarget
      : "passage";
  const rawAction =
    typeof record.action === "string" ? record.action.trim().toLowerCase() : "";
  const action: StepDirective["action"] =
    rawAction === "highlight" ||
    rawAction === "underline" ||
    rawAction === "circle" ||
    rawAction === "strike" ||
    rawAction === "note" ||
    rawAction === "color" ||
    rawAction === "font"
      ? rawAction
      : "underline";
  return {
    target,
    text,
    action,
  };
}

