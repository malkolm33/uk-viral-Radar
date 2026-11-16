import { ImageResponse } from "next/og";
import { getPostBySlug, isPostVisible } from "../../lib/blog-posts";
import { themeFor, RISING, DECLINING } from "../../lib/panel-themes";

// Branded 1200x630 cover image for a blog post, generated from its title and
// category. Used when a post has no photo of its own: it is always relevant,
// it is our own artwork (no licensing questions) and it doubles as the social
// share (Open Graph) image. Usage in blog-posts.ts: imageUrl: "/blog-cover/<slug>"
export const revalidate = 86400;

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post || !isPostVisible(post)) {
    return new Response("Not found", { status: 404 });
  }

  const bars = post.chart ? [...post.chart.items].sort((a, b) => b.score - a.score).slice(0, 5) : [];
  const hasChart = bars.length > 0;
  const titleSize = hasChart ? (post.title.length > 50 ? 44 : 52) : post.title.length > 60 ? 54 : post.title.length > 40 ? 62 : 72;
  const maxScore = Math.max(...bars.map((b) => b.score), 1);
  const t = themeFor(slug); // light colours, different per post

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: `linear-gradient(135deg, ${t.coverFrom} 0%, ${t.coverTo} 100%)`,
          border: `10px solid ${t.frame}`,
          position: "relative",
        }}
      >
        {/* Decorative radar rings (brand motif) */}
        <div
          style={{
            position: "absolute",
            right: -120,
            top: -120,
            width: 520,
            height: 520,
            borderRadius: "50%",
            border: `3px solid ${t.frame}40`,
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            width: 280,
            height: 280,
            borderRadius: "50%",
            border: `3px solid ${t.frame}66`,
            display: "flex",
          }}
        />
        <div style={{ display: "flex" }}>
          <div
            style={{
              display: "flex",
              fontSize: 26,
              fontWeight: 700,
              color: "#FFFFFF",
              backgroundColor: t.headerFrom,
              padding: "8px 20px",
              borderRadius: 999,
            }}
          >
            {post.category}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: titleSize,
            fontWeight: 800,
            color: "#0F172A",
            lineHeight: 1.15,
            maxWidth: 1000,
          }}
        >
          {post.title}
        </div>
        {hasChart && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 1000 }}>
            {bars.map((b) => (
              <div key={b.name} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ display: "flex", width: 260, fontSize: 22, color: "#334155" }}>{b.name}</div>
                <div style={{ display: "flex", flex: 1, height: 22, backgroundColor: "rgba(255,255,255,0.75)", borderRadius: 4 }}>
                  <div
                    style={{
                      display: "flex",
                      width: `${Math.max(4, (b.score / maxScore) * 100)}%`,
                      height: 22,
                      borderRadius: 4,
                      backgroundColor: b.rising ? RISING : typeof b.change === "number" && b.change <= -15 ? DECLINING : t.bar,
                    }}
                  />
                </div>
                <div style={{ display: "flex", width: 150, justifyContent: "flex-end", fontSize: 22, fontWeight: 700, color: b.rising ? "#15803D" : "#0F172A" }}>
                  {b.rising ? "▲ " : ""}
                  {b.score}
                </div>
              </div>
            ))}
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              display: "flex",
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #2563EB, #38BDF8)",
            }}
          />
          <div style={{ display: "flex", fontSize: 30, fontWeight: 700, color: "#0F172A" }}>UK Viral Radar</div>
          <div style={{ display: "flex", fontSize: 26, color: t.accent, marginLeft: 12 }}>ukviralradar.com</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
