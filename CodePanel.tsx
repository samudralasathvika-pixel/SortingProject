import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import type { CodeLanguage } from "@/lib/sorting/codeSnippets";

interface CodePanelProps {
  code: string;
  activeLine: number;
  actionLabel?: string;
  language: CodeLanguage;
  onLanguageChange: (l: CodeLanguage) => void;
}

const KEYWORDS_BY_LANG: Record<CodeLanguage, Set<string>> = {
  java: new Set([
    "void", "int", "if", "else", "for", "while", "return", "new", "do", "switch",
    "case", "break", "continue", "class", "static", "public", "private", "boolean",
  ]),
  c: new Set([
    "void", "int", "if", "else", "for", "while", "return", "do", "switch",
    "case", "break", "continue", "struct", "static", "const", "char", "float",
  ]),
  cpp: new Set([
    "void", "int", "if", "else", "for", "while", "return", "do", "switch", "case",
    "break", "continue", "class", "struct", "static", "const", "auto", "vector",
    "swap", "public", "private",
  ]),
  python: new Set([
    "def", "if", "else", "elif", "for", "while", "return", "in", "range",
    "and", "or", "not", "len", "True", "False", "None", "import", "from",
  ]),
};

const COMMENT_PREFIX: Record<CodeLanguage, string> = {
  java: "//",
  c: "//",
  cpp: "//",
  python: "#",
};

const LANG_LABELS: { id: CodeLanguage; label: string }[] = [
  { id: "java", label: "Java" },
  { id: "c", label: "C" },
  { id: "cpp", label: "C++" },
  { id: "python", label: "Python" },
];

function highlight(line: string, language: CodeLanguage) {
  const tokens: { text: string; cls?: string }[] = [];
  const prefix = COMMENT_PREFIX[language];
  const commentIdx = line.indexOf(prefix);
  let codePart = line;
  let commentPart = "";
  if (commentIdx >= 0) {
    codePart = line.slice(0, commentIdx);
    commentPart = line.slice(commentIdx);
  }
  const keywords = KEYWORDS_BY_LANG[language];
  const re = /(\".*?\")|(\b\d+\b)|([A-Za-z_][A-Za-z0-9_]*)|(\s+)|([^\s\w])/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(codePart)) !== null) {
    const t = m[0];
    if (m[1]) tokens.push({ text: t, cls: "text-code-string" });
    else if (m[2]) tokens.push({ text: t, cls: "text-code-number" });
    else if (m[3]) {
      if (keywords.has(t)) tokens.push({ text: t, cls: "text-code-keyword" });
      else tokens.push({ text: t });
    } else tokens.push({ text: t });
  }
  if (commentPart) tokens.push({ text: commentPart, cls: "text-code-comment" });
  return tokens;
}

export const CodePanel = ({
  code,
  activeLine,
  actionLabel,
  language,
  onLanguageChange,
}: CodePanelProps) => {
  const lines = code.split("\n");
  const activeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [activeLine]);

  return (
    <div className="panel flex h-[420px] flex-col overflow-hidden bg-code-bg p-0">
      {/* Language tabs */}
      <div className="flex shrink-0 items-center gap-1 border-b border-border bg-code-bg/95 px-2 pt-2">
        {LANG_LABELS.map((l) => {
          const active = l.id === language;
          return (
            <button
              key={l.id}
              onClick={() => onLanguageChange(l.id)}
              className={cn(
                "code-font rounded-t-md px-3 py-1.5 text-xs transition-colors",
                active
                  ? "bg-background text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {l.label}
            </button>
          );
        })}
      </div>

      {/* Action description bar */}
      <div className="sticky top-0 z-10 flex shrink-0 items-center justify-between gap-3 border-b border-border bg-code-bg/95 px-4 py-2 backdrop-blur">
        <span className="code-font truncate text-xs text-foreground">
          {actionLabel ?? "Idle — press Play to start"}
        </span>
        <span className="code-font shrink-0 text-xs text-code-active">
          L{activeLine || "—"}
        </span>
      </div>

      {/* Code */}
      <pre className="code-font flex-1 overflow-auto text-[13px] leading-6">
        {lines.map((line, idx) => {
          const lineNo = idx + 1;
          const isActive = lineNo === activeLine;
          const tokens = highlight(line, language);
          return (
            <div
              key={lineNo}
              ref={isActive ? activeRef : null}
              className={cn(
                "flex border-l-2 px-3 transition-colors",
                isActive
                  ? "border-l-code-active bg-code-active/10"
                  : "border-l-transparent",
              )}
            >
              <span className="mr-4 w-6 select-none text-right text-muted-foreground/70">
                {lineNo}
              </span>
              <code className="whitespace-pre">
                {tokens.map((tk, i) => (
                  <span key={i} className={tk.cls}>
                    {tk.text}
                  </span>
                ))}
              </code>
            </div>
          );
        })}
      </pre>
    </div>
  );
};
