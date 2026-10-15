import { marked } from "marked";
import hljs from "highlight.js";
import sanitizeHtml from "sanitize-html";

marked.use({
  renderer: {
    code({ text, lang }) {
      const requestedLanguage = lang?.trim().split(/\s+/)[0].toLowerCase() || "text";
      const language = hljs.getLanguage(requestedLanguage) ? requestedLanguage : "text";
      const highlighted = language === "text"
        ? escapeHtml(text)
        : hljs.highlight(text, { language }).value;
      const lineNumbers = Array.from({ length: Math.max(1, text.split(/\r?\n/).length) }, (_, index) => index + 1).join("\n");
      const label = languageLabel(requestedLanguage);

      return `<div class="code-block" data-language="${escapeHtml(requestedLanguage)}">
        <div class="code-block__header">
          <span>${label}</span>
          <button type="button" class="code-block__copy" data-copy-code aria-label="Copy ${label} code">Copy</button>
        </div>
        <div class="code-block__body">
          <pre class="code-block__numbers" aria-hidden="true">${lineNumbers}</pre>
          <pre class="code-block__pre"><code class="hljs language-${escapeHtml(language)}">${highlighted}</code></pre>
        </div>
      </div>`;
    }
  }
});

export function renderMarkdown(markdown: string): string {
  const html = marked.parse(markdown, { async: false }) as string;
  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "button"]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      "*": ["class", "data-language"],
      a: ["href", "name", "target", "rel"],
      img: ["src", "alt"],
      button: ["type", "class", "data-copy-code", "aria-label"]
    }
  });
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function languageLabel(language: string): string {
  const labels: Record<string, string> = {
    ts: "TypeScript",
    js: "JavaScript",
    sh: "Shell",
    html: "HTML",
    css: "CSS",
    json: "JSON",
    diff: "Diff",
    text: "Text"
  };
  return labels[language] ?? language.toUpperCase();
}
