import { ImageResponse } from "next/og";
import { getPostBySlug, isPostVisible } from "../../lib/blog-posts";

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

  const titleSize = post.title.length > 60 ? 54 : post.title.length > 40 ? 62 : 72;

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
          backgroundColor: "#0B1220",
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
            border: "2px solid rgba(56,189,248,0.18)",
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
            border: "2px solid rgba(56,189,248,0.28)",
            display: "flex",
          }}
        />
        <div style={{ display: "flex" }}>
          <div
            style={{
              display: "flex",
              fontSize: 26,
              fontWeight: 700,
              color: "#22C55E",
              backgroundColor: "rgba(34,197,94,0.12)",
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
            color: "#FFFFFF",
            lineHeight: 1.15,
            maxWidth: 1000,
          }}
        >
          {post.title}
        </div>
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
          <div style={{ display: "flex", fontSize: 30, fontWeight: 700, color: "#FFFFFF" }}>UK Viral Radar</div>
          <div style={{ display: "flex", fontSize: 26, color: "#93A3B8", marginLeft: 12 }}>ukviralradar.com</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
