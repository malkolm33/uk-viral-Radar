import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  blogPosts,
  getPostBySlug,
  isPostVisible,
  getReadingTimeMinutes,
  getRelatedPosts,
} from "../../lib/blog-posts";

// Only pre-render posts that aren't pure drafts. A "scheduled" post whose
// date hasn't arrived yet still gets a page here, but the component below
// hides it with notFound() until isPostVisible() says it's due.
export function generateStaticParams() {
  return blogPosts.filter((post) => post.status !== "draft").map((post) => ({ slug: post.slug }));
}

// Re-checks whether a scheduled post has gone live at most once an hour,
// instead of only ever picking up the change on a fresh deploy.
export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post || !isPostVisible(post)) {
    return { title: "Post Not Found - UK Viral Radar" };
  }

  const title = `${post.title} - UK Viral Radar`;
  return {
    title,
    description: post.excerpt,
    openGraph: {
      title,
      description: post.excerpt,
      type: "article",
      images: post.imageUrl ? [post.imageUrl] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: post.excerpt,
      images: post.imageUrl ? [post.imageUrl] : undefined,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post || !isPostVisible(post)) {
    notFound();
  }

  const blocks = post.content.split(/\n\n+/);
  const readingTime = getReadingTimeMinutes(post);
  const relatedPosts = getRelatedPosts(post);

  return (
    <main className="min-h-screen bg-[#F7F8FA] px-6 py-12 sm:px-10">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="mb-8 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#0F172A] text-sm font-bold text-white">
            R
          </div>
          <span className="text-sm font-semibold text-[#0F172A]">UK Viral Radar</span>
        </Link>

        <div className="rounded-lg border border-[#E4E7EC] bg-white p-8 sm:p-10">
          <span className="rounded-full bg-[#F7F8FA] px-2 py-0.5 text-[10px] font-medium text-[#64748B]">
            {post.category}
          </span>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-[#0F172A] sm:text-3xl">
            {post.title}
          </h1>

          {post.imageUrl && (
            <img
              src={post.imageUrl}
              alt={post.title}
              className="mt-6 h-64 w-full rounded-lg object-cover sm:h-80 md:h-[400px]"
            />
          )}

          <p className="mt-4 text-sm text-[#64748B]">
            {new Date(post.date).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
            {" · "}
            {readingTime} min read
          </p>

          <div className="mt-8 space-y-6 text-sm leading-relaxed">
            {blocks.map((block, i) => {
              if (block.startsWith("## ")) {
                return (
                  <h2
                    key={i}
                    className="!mt-8 text-base font-semibold text-[#0F172A] sm:text-lg"
                  >
                    {block.slice(3)}
                  </h2>
                );
              }
              return (
                <p key={i} className="text-[#64748B]">
                  {block}
                </p>
              );
            })}
          </div>
        </div>

        {relatedPosts.length > 0 && (
          <div className="mt-6 rounded-lg border border-[#E4E7EC] bg-white p-6 sm:p-8">
            <h2 className="text-sm font-semibold text-[#0F172A]">Related posts</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {relatedPosts.map((related) => (
                <Link
                  key={related.slug}
                  href={`/blog/${related.slug}`}
                  className="block overflow-hidden rounded-lg border border-[#E4E7EC] transition-colors hover:border-[#16A34A]"
                >
                  {related.imageUrl && (
                    <img
                      src={related.imageUrl}
                      alt={related.title}
                      className="aspect-video w-full object-cover"
                    />
                  )}
                  <div className="p-4">
                    <p className="text-sm font-medium text-[#0F172A]">{related.title}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <p className="mt-6 text-center text-xs text-[#64748B]">
          <Link href="/blog" className="hover:text-[#0F172A]">
            Back to blog
          </Link>
        </p>
      </div>
    </main>
  );
}
