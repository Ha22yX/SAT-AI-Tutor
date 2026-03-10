"use client";

import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

export type Translator = (key: string, params?: Record<string, unknown>) => string;

export type StepDirective = {
  target: "passage" | "stem" | "choices" | "figure";
  text: string;
  action?: "highlight" | "underline" | "circle" | "strike" | "note" | "color" | "font";
  cue?: string;
  emphasis?: string;
  figure_id?: number | string;
  choice_id?: string | number;
};

export type AnimStep = {
  id?: string;
  title?: string;
  type?: string;
  narration?: string | Record<string, string>;
  duration_ms?: number;
  delay_ms?: number;
  animations?: StepDirective[];
  board_notes?: string[];
};

export type AnimExplanation = {
  protocol_version?: string;
  summary?: string;
  language?: string;
  steps?: AnimStep[];
};

type HighlightedTextProps = {
  text?: string;
  directives?: StepDirective[];
  className?: string;
};

export function HighlightedText({ text, directives = [], className }: HighlightedTextProps) {
  const normalizedDirectives = useMemo(
    () =>
      (directives || []).filter(
        (d) => d && typeof d.text === "string" && d.text.trim().length > 0
      ),
    [directives]
  );
  const decorationPlugin = useMemo(
    () => createDecorationRehypePlugin(normalizedDirectives),
    [normalizedDirectives]
  );

  if (!text?.trim()) {
    return null;
  }

  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex, decorationPlugin]}
        skipHtml
        components={{
          p: ({ children }) => (
            <p className="mb-2 whitespace-pre-wrap leading-relaxed last:mb-0">{children}</p>
          ),
          ul: ({ children }) => <ul className="mb-2 list-disc pl-5 last:mb-0">{children}</ul>,
          ol: ({ children }) => <ol className="mb-2 list-decimal pl-5 last:mb-0">{children}</ol>,
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          code: ({ children }) => (
            <code className="rounded bg-white/10 px-1 py-0.5 text-[0.95em]">{children}</code>
          ),
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
}

function getDirectiveClass(action?: string) {
  switch (action) {
    case "underline":
      // Only underline without highlight color
      return "underline decoration-white/80 decoration-2 bg-transparent text-inherit";
    case "circle":
      return "outline outline-2 outline-amber-300 rounded-full";
    case "strike":
      return "line-through decoration-rose-300";
    case "note":
      return "bg-emerald-400/30 text-emerald-100";
    case "color":
      return "bg-transparent";
    case "font":
      return "italic text-sky-200";
    default:
      return "bg-amber-300/40";
  }
}

type HastNode = {
  type?: string;
  value?: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
};

function createDecorationRehypePlugin(directives: StepDirective[]) {
  return function decorationPlugin(tree: HastNode) {
    if (!directives.length) return;
    decorateTreeTextNodes(tree, directives, false);
  };
}

function decorateTreeTextNodes(
  node: HastNode | undefined,
  directives: StepDirective[],
  insideKatex: boolean
): void {
  if (!node || !Array.isArray(node.children) || !node.children.length) {
    return;
  }

  const parentTag = String(node.tagName || "").toLowerCase();
  const parentProps = node.properties || {};
  const className = parentProps["className"];
  const classNames = Array.isArray(className)
    ? className.map(String)
    : typeof className === "string"
    ? className.split(/\s+/)
    : [];
  const nowInsideKatex = insideKatex || classNames.some((name) => name.includes("katex"));
  const shouldSkipTextDecoration =
    parentTag === "code" || parentTag === "pre" || parentTag === "script" || parentTag === "style";

  for (let index = 0; index < node.children.length; index += 1) {
    const child = node.children[index];
    if (!child) continue;

    if (
      child.type === "text" &&
      typeof child.value === "string" &&
      child.value &&
      !shouldSkipTextDecoration &&
      !nowInsideKatex
    ) {
      const segments = splitTextByDirectives(child.value, directives);
      if (segments.length > 1) {
        const replacementNodes = segments.map((segment) => {
          if (!segment.action) {
            return { type: "text", value: segment.text } as HastNode;
          }
          const classes = getDirectiveClass(segment.action)
            .split(/\s+/)
            .filter(Boolean);
          return {
            type: "element",
            tagName: "mark",
            properties: {
              className: ["rounded", "px-1", ...classes],
              dataAction: segment.action,
            },
            children: [{ type: "text", value: segment.text }],
          } as HastNode;
        });
        node.children.splice(index, 1, ...replacementNodes);
        index += replacementNodes.length - 1;
      }
      continue;
    }

    decorateTreeTextNodes(child, directives, nowInsideKatex);
  }
}

function splitTextByDirectives(
  value: string,
  directives: StepDirective[]
): Array<{ text: string; action?: StepDirective["action"] }> {
  if (!value || !directives.length) {
    return [{ text: value }];
  }

  let cursor = 0;
  let working = value;
  const out: Array<{ text: string; action?: StepDirective["action"] }> = [];

  for (const directive of directives) {
    const snippet = directive.text?.trim();
    if (!snippet) continue;
    const hit = working.toLowerCase().indexOf(snippet.toLowerCase());
    if (hit < 0) continue;

    const absoluteStart = cursor + hit;
    const absoluteEnd = absoluteStart + snippet.length;
    if (absoluteStart > cursor) {
      out.push({ text: value.slice(cursor, absoluteStart) });
    }
    out.push({
      text: value.slice(absoluteStart, absoluteEnd),
      action: directive.action,
    });
    cursor = absoluteEnd;
    working = value.slice(cursor);
  }

  if (cursor < value.length) {
    out.push({ text: value.slice(cursor) });
  }

  return out.length ? out : [{ text: value }];
}

function MathText({ text, className }: { text?: string; className?: string }) {
  if (!text) return null;
  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          p: ({ node, ...props }) => (
            <p className="mb-2 whitespace-pre-wrap leading-relaxed last:mb-0" {...props} />
          ),
          ul: ({ node, ...props }) => <ul className="mb-2 list-disc pl-5 last:mb-0" {...props} />,
          ol: ({ node, ...props }) => <ol className="mb-2 list-decimal pl-5 last:mb-0" {...props} />,
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
}

type ExplanationViewerProps = {
  explanation: AnimExplanation;
  onDirectivesChange?: (directives: StepDirective[]) => void;
  t: Translator;
};

export function ExplanationViewer({
  explanation,
  onDirectivesChange,
  t,
}: ExplanationViewerProps) {
  const rawSteps: AnimStep[] = useMemo(() => explanation.steps ?? [], [explanation]);
  const steps: AnimStep[] = useMemo(() => {
    if (!explanation.summary) {
      return rawSteps;
    }
    return [
      ...rawSteps,
      {
        id: "session-summary",
        type: "summary",
        title: t("practice.explain.summaryTitle"),
        narration: explanation.summary,
        duration_ms: 2800,
        delay_ms: 600,
        animations: [],
        board_notes: [],
      },
    ];
  }, [rawSteps, explanation.summary, t]);
  const language = explanation.language ?? "en";
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [subtitle, setSubtitle] = useState("");

  useEffect(() => {
    setCurrentStep(0);
    setIsPlaying(false);
  }, [explanation]);

  const narrationFor = useCallback(
    (step: AnimStep | undefined) => {
      if (!step) return "";
      const narration = step.narration;
      if (!narration) return "";
      if (typeof narration === "string") return narration;
      return narration[language] || narration.en || narration.zh || "";
    },
    [language]
  );

  useEffect(() => {
    const step = steps[currentStep];
    const textValue = narrationFor(step);
    setSubtitle("");
    if (!textValue) {
      return;
    }
    let index = 0;
    const interval = setInterval(() => {
      index += 1;
      setSubtitle(textValue.slice(0, index));
      if (index >= textValue.length) {
        clearInterval(interval);
      }
    }, 25);
    return () => clearInterval(interval);
  }, [currentStep, steps, narrationFor]);

  useEffect(() => {
    if (!isPlaying) return;
    const step = steps[currentStep];
    if (!step) return;
    const total =
      Math.max(step.duration_ms ?? 3000, 500) + Math.max(step.delay_ms ?? 500, 0);
    const timer = setTimeout(() => {
      if (currentStep < steps.length - 1) {
        setCurrentStep((prev) => prev + 1);
      } else {
        setIsPlaying(false);
      }
    }, total);
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, steps]);

  const goToStep = (nextIndex: number) => {
    if (nextIndex < 0 || nextIndex >= steps.length) return;
    setCurrentStep(nextIndex);
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (!steps.length) return;
    setIsPlaying((prev) => !prev);
  };

  const step = steps[currentStep];

  useEffect(() => {
    if (onDirectivesChange) {
      onDirectivesChange(step?.animations ?? []);
      return () => onDirectivesChange([]);
    }
    return () => undefined;
  }, [step, onDirectivesChange]);

  return (
    <div className="space-y-4 rounded-xl border border-white/10 bg-white/5 p-4 text-xs text-white/80">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-white">{t("practice.explain.title")}</p>
          <p className="text-white/60">
            {t("practice.explain.stepIndicator", {
              current: Math.min(currentStep + 1, Math.max(steps.length, 1)),
              total: Math.max(steps.length, 1),
            })}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/80 disabled:opacity-30"
            onClick={() => goToStep(currentStep - 1)}
            disabled={currentStep === 0}
            type="button"
          >
            ◀
          </button>
          <button
            className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/80 disabled:opacity-30"
            onClick={togglePlay}
            disabled={!steps.length}
            type="button"
          >
            {isPlaying ? t("practice.explain.pause") : t("practice.explain.play")}
          </button>
          <button
            className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/80 disabled:opacity-30"
            onClick={() => goToStep(currentStep + 1)}
            disabled={currentStep >= steps.length - 1}
            type="button"
          >
            ▶
          </button>
        </div>
      </div>

      {step && (
        <div className="space-y-2">
          <div className="rounded-lg border border-white/10 bg-[#050E1F]/40 p-3">
            <p className="text-white text-sm font-semibold">
              {step.title || t("practice.explain.stepTitle", { current: currentStep + 1 })}
            </p>
            <p className="text-white/60 text-xs capitalize">
              {step.type || t("practice.explain.defaultType")}
            </p>
          </div>
          {step.board_notes?.length ? (
            <ul className="list-disc space-y-1 rounded-lg border border-white/10 bg-transparent px-5 py-2 text-white/60">
              {step.board_notes.map((note, idx) => (
                <li key={idx}>
                  <MathText text={note} />
                </li>
              ))}
            </ul>
          ) : null}
          <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white">
            {isPlaying && subtitle ? (
              <p className="whitespace-pre-wrap leading-relaxed">{subtitle}</p>
            ) : (
              <MathText text={narrationFor(step)} />
            )}
          </div>
          <p className="text-white/40 text-[11px]">
            {t("practice.explain.duration", {
              seconds: Math.round((step.duration_ms ?? 0) / 100) / 10,
              delay: Math.round((step.delay_ms ?? 0) / 100) / 10,
            })}
          </p>
        </div>
      )}
      {!steps.length && (
        <p className="text-white/60 text-sm">{t("practice.explain.empty")}</p>
      )}
    </div>
  );
}

