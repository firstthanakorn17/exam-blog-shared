import React from "react";
import { slugify } from "../seo";

export function SharedMarkdownProse({ content }: { content: string }) {
  const blocks = (content || "").split(/\n\n+/);

  return (
    <div className="space-y-4 leading-relaxed text-zinc-800">
      {blocks.map((block, index) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        if (trimmed.startsWith("### ")) {
          const text = trimmed.slice(4);
          return (
            <h3
              key={index}
              id={slugify(text) || `h3-${index}`}
              className="text-lg font-semibold tracking-tight text-zinc-900 pt-3 scroll-mt-20"
            >
              {text}
            </h3>
          );
        }

        if (trimmed.startsWith("## ")) {
          const text = trimmed.slice(3);
          return (
            <h2
              key={index}
              id={slugify(text) || `h2-${index}`}
              className="text-xl font-bold tracking-tight text-zinc-900 pt-4 scroll-mt-20"
            >
              {text}
            </h2>
          );
        }

        if (trimmed.startsWith("# ")) {
          const text = trimmed.slice(2);
          return (
            <h2
              key={index}
              id={slugify(text) || `h1-${index}`}
              className="text-2xl font-bold tracking-tight text-zinc-900 pt-4 scroll-mt-20"
            >
              {text}
            </h2>
          );
        }

        if (trimmed.startsWith("```")) {
          const code = trimmed.replace(/^```\w*\n?/, "").replace(/```$/, "");
          return (
            <pre
              key={index}
              className="rounded-xl border border-zinc-200 bg-zinc-950 text-zinc-100 p-4 text-[13px] font-mono overflow-x-auto"
            >
              <code>{code}</code>
            </pre>
          );
        }

        return (
          <p key={index} className="text-[15px] leading-7 text-zinc-700">
            {trimmed}
          </p>
        );
      })}
    </div>
  );
}
