import Link from "next/link";
import type { Metadata } from "next";
import { getVisiblePosts } from "../lib/blog-posts";

export const metadata: Metadata = {
  title: "Blog - UK Viral Radar",
  description:
    "Tips, trends and insights for UK dropshippers and e-commerce sellers, from UK Viral Radar.",
  openGraph: {
    title: "Blog - UK Viral Radar",
    description:
      "Tips, trends and insights for UK dropshippers and e-commerce sellers, from UK Viral Radar.",
    type: "website",
  },
};

// Re-checks which scheduled posts have gone live at most once an hour,
// instead of only ever picking up new posts on a fresh deploy.
export const revalidate = 3600;

export default function BlogPage() {
  const sortedPosts = [...getVisiblePosts()].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <main className="min-h-screen bg-[#F7F8FA] px-6 py-10 sm:px-10">
      <div className="mx-auto max-w-4xl">
        <header className="mb-10 flex flex-wrap items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#0F172A] text-sm font-bold text-white">
              R
            </div>
            <span className="text-sm font-semibold text-[#0F172A]">UK Viral Radar</span>
          </Link>
          <Link href="/" className="text-sm text-[#64748B] hover:text-[#0F172A]">
            Back to home
          </Link>
        </header>

        <h1 className="text-3xl font-bold tracking-tight text-[#0F172A] sm:text-4xl">Blog</h1>
        <p className="mt-2 text-sm text-[#64748B] sm:text-base">
          Tips, trends and insights for UK dropshippers and e-commerce sellers.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {sortedPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block rounded-lg border border-[#E4E7EC] bg-white p-6 transition-colors hover:border-[#16A34A]"
            >
              <span className="rounded-full bg-[#F7F8FA] px-2 py-0.5 text-[10px] font-medium text-[#64748B]">
                {post.category}
              </span>
              <h2 className="mt-3 text-lg font-semibold text-[#0F172A]">{post.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-[#64748B]">{post.excerpt}</p>
              <div className="mt-4 flex items-center justify-between text-xs text-[#64748B]">
                <span>
                  {new Date(post.date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
                <span className="font-medium text-[#16A34A]">Read more &rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
