import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { blogPosts, getPostBySlug } from "../../lib/blog-posts";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
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

  if (!post) {
    notFound();
  }

  const paragraphs = post.content.split(/\n\n+/);

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
          <p className="mt-2 text-sm text-[#64748B]">
            {new Date(post.date).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </p>

          <div className="mt-8 space-y-4 text-sm leading-relaxed">
            {paragraphs.map((paragraph, i) => (
              <p key={i} className="text-[#64748B]">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-[#64748B]">
          <Link href="/blog" className="hover:text-[#0F172A]">
            Back to blog
          </Link>
        </p>
      </div>
    </main>
  );
}
