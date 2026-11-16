// "In this article" box shown near the top of every post that has no data
// panel: a turquoise-framed list of the post's sections, each with its own
// coloured number, linking to the matching heading.
export function headingId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

const COLOURS = ["#0D9488", "#2F8FE0", "#1FAF6A", "#D97706", "#7C3AED", "#DB2777"];

export default function ArticleGuide({ headings, minutes }: { headings: string[]; minutes: number }) {
  if (headings.length < 3) return null;
  return (
    <nav
      aria-label="In this article"
      className="!my-8 overflow-hidden rounded-xl border-2 border-[#14B8A6] bg-white shadow-[0_10px_30px_-12px_rgba(20,184,166,0.45)]"
    >
      <div className="flex items-center justify-between gap-2 bg-gradient-to-r from-[#0F766E] via-[#0D9488] to-[#14B8A6] px-4 py-3">
        <span className="text-sm font-semibold tracking-wide text-white">In this article</span>
        <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-medium text-white">
          {headings.length} sections · {minutes} min read
        </span>
      </div>
      <ol className="grid gap-1 p-3 sm:grid-cols-2 sm:p-4">
        {headings.map((h, i) => (
          <li key={h}>
            <a
              href={`#${headingId(h)}`}
              className="flex items-start gap-3 rounded-lg px-2 py-2 text-sm text-[#0F172A] transition-colors hover:bg-[#F0FDFA]"
            >
              <span
                className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
                style={{ background: COLOURS[i % COLOURS.length] }}
                aria-hidden="true"
              >
                {i + 1}
              </span>
              <span className="leading-snug">{h}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
