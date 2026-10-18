import React from "react";
import { slugify } from "../seo";

export function SharedMarkdownProse({ content }: { content: string }) {
  const blocks = (content || "").split(/\n\n+/);

  return (
    <div className="space-y-4 leading-relaxed text-slate-800">
      {blocks.map((block, index) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        if (trimmed.startsWith("### ")) {
          const text = trimmed.slice(4);
          const id = slugify(text) || `h3-${index}`;
          return (
            <h3
              key={index}
              id={id}
              className="group text-lg font-bold tracking-tight text-slate-900 pt-3 scroll-mt-24 flex items-center gap-2"
            >
              <span>{text}</span>
              <a
                href={`#${id}`}
                aria-label={`ลิงก์ไปยังหัวข้อ ${text}`}
                className="opacity-0 group-hover:opacity-100 text-indigo-500 text-sm font-mono transition"
              >
                #
              </a>
            </h3>
          );
        }

        if (trimmed.startsWith("## ")) {
          const text = trimmed.slice(3);
          const id = slugify(text) || `h2-${index}`;
          return (
            <h2
              key={index}
              id={id}
              className="group text-xl font-extrabold tracking-tight text-slate-900 pt-4 scroll-mt-24 flex items-center gap-2"
            >
              <span>{text}</span>
              <a
                href={`#${id}`}
                aria-label={`ลิงก์ไปยังหัวข้อ ${text}`}
                className="opacity-0 group-hover:opacity-100 text-indigo-500 text-base font-mono transition"
              >
                #
              </a>
            </h2>
          );
        }

        if (trimmed.startsWith("# ")) {
          const text = trimmed.slice(2);
          const id = slugify(text) || `h1-${index}`;
          return (
            <h2
              key={index}
              id={id}
              className="group text-2xl font-extrabold tracking-tight text-slate-900 pt-4 scroll-mt-24 flex items-center gap-2"
            >
              <span>{text}</span>
              <a
                href={`#${id}`}
                aria-label={`ลิงก์ไปยังหัวข้อ ${text}`}
                className="opacity-0 group-hover:opacity-100 text-indigo-500 text-base font-mono transition"
              >
                #
              </a>
            </h2>
          );
        }

        if (trimmed.startsWith("```")) {
          const code = trimmed.replace(/^```\w*\n?/, "").replace(/```$/, "");
          return (
            <pre
              key={index}
              className="rounded-xl border border-slate-800 bg-slate-950 text-slate-100 p-4 text-[13px] font-mono overflow-x-auto"
            >
              <code>{code}</code>
            </pre>
          );
        }

        return (
          <p key={index} className="text-[15.5px] leading-8">
            {trimmed}
          </p>
        );
      })}
    </div>
  );
}
