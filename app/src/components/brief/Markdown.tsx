import { cn } from "@/lib/cn";

/**
 * Brief body renderer (v2).
 * Supports: ## headings, paragraphs, *italic*, **bold**, simple tables, and
 * highlighted pull-quote (a paragraph beginning with `> `).
 *
 * Zero client JS, server-rendered.
 */

type Block =
  | { kind: "h2"; text: string }
  | { kind: "p"; text: string }
  | { kind: "quote"; text: string }
  | { kind: "table"; rows: string[][] };

function parseInline(s: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  while ((match = re.exec(s)) !== null) {
    if (match.index > last) nodes.push(s.slice(last, match.index));
    const m = match[0];
    if (m.startsWith("**")) {
      nodes.push(<strong key={key++}>{m.slice(2, -2)}</strong>);
    } else {
      nodes.push(<em key={key++}>{m.slice(1, -1)}</em>);
    }
    last = match.index + m.length;
  }
  if (last < s.length) nodes.push(s.slice(last));
  return nodes;
}

function parse(md: string): Block[] {
  const lines = md.split("\n");
  const blocks: Block[] = [];
  let buf: string[] = [];

  const flushP = () => {
    if (buf.length) {
      const text = buf.join(" ").trim();
      if (text.startsWith("> ")) {
        blocks.push({ kind: "quote", text: text.slice(2) });
      } else {
        blocks.push({ kind: "p", text });
      }
      buf = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trimEnd();

    if (line.startsWith("## ")) {
      flushP();
      blocks.push({ kind: "h2", text: line.slice(3).trim() });
      continue;
    }

    if (line.startsWith("|")) {
      flushP();
      const rows: string[][] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        const cells = lines[i]
          .trim()
          .replace(/^\||\|$/g, "")
          .split("|")
          .map((c) => c.trim());
        if (!cells.every((c) => /^[-: ]+$/.test(c))) rows.push(cells);
        i++;
      }
      i--;
      if (rows.length) blocks.push({ kind: "table", rows });
      continue;
    }

    if (line === "") {
      flushP();
      continue;
    }

    buf.push(line);
  }
  flushP();

  return blocks;
}

export function Markdown({ source, className }: { source: string; className?: string }) {
  const blocks = parse(source);

  return (
    <div className={cn("prose-brief", className)}>
      {blocks.map((b, i) => {
        if (b.kind === "h2") {
          return (
            <h2
              key={i}
              className="font-serif font-medium text-[22px] text-ink mt-8 mb-3 tracking-[-0.005em]"
            >
              {b.text}
            </h2>
          );
        }
        if (b.kind === "quote") {
          return (
            <blockquote key={i} className="highlight-quote">
              {parseInline(b.text)}
            </blockquote>
          );
        }
        if (b.kind === "table") {
          const [head, ...body] = b.rows;
          return (
            <div key={i} className="my-6 overflow-hidden rounded-2xl border" style={{borderColor: "var(--line)"}}>
              <table className="w-full text-[14px]">
                <thead>
                  <tr style={{background: "var(--cream-2)"}}>
                    {head.map((c, j) => (
                      <th
                        key={j}
                        className="text-left font-sans text-[11px] tracking-[0.04em] uppercase text-ink-3 px-3 py-2.5 font-semibold"
                      >
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {body.map((row, r) => (
                    <tr key={r} style={{borderTop: "0.5px solid var(--line)"}}>
                      {row.map((c, j) => (
                        <td key={j} className="px-3 py-2.5 align-top text-ink font-serif text-[15px]">
                          {parseInline(c)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
        return <p key={i}>{parseInline(b.text)}</p>;
      })}
    </div>
  );
}
