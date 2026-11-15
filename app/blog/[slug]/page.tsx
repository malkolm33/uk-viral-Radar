import Image from "next/image";import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  blogPosts,
  getPostBySlug,
  isPostVisible,
  getReadingTimeMinutes,
  getRelatedPosts,
} from "../../lib/blog-posts";
import { SITE_URL, SITE_NAME, jsonLd } from "../../lib/site";

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

  // Keep the brand suffix only when the whole title still fits in Google's
  // ~65-character display; long headlines are shown on their own.
  const branded = `${post.title} - UK Viral Radar`;
  const title = branded.length <= 65 ? branded : post.title;
  const url = `/blog/${post.slug}`;
  return {
    title,
    description: post.excerpt,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: post.excerpt,
      type: "article",
      url,
      publishedTime: post.publishDate || post.date,
      modifiedTime: post.date,
      section: post.category,
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

  const postUrl = `${SITE_URL}/blog/${post.slug}`;
  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${postUrl}#article`,
    headline: post.title,
    description: post.excerpt,
    url: postUrl,
    mainEntityOfPage: postUrl,
    datePublished: post.publishDate || post.date,
    dateModified: post.date,
    articleSection: post.category,
    inLanguage: "en-GB",
    wordCount: post.content.trim().split(/\s+/).filter(Boolean).length,
    image: post.imageUrl ? [post.imageUrl] : undefined,
    author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    publisher: { "@id": `${SITE_URL}/#organization`, "@type": "Organization", name: SITE_NAME, url: SITE_URL },
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: postUrl },
    ],
  };

  return (
    <main className="min-h-screen bg-[#F7F8FA] px-6 py-12 sm:px-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(blogPostingSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema) }} />
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
            <div className="relative mt-6 h-64 w-full overflow-hidden rounded-lg sm:h-80 md:h-[400px]">
              <Image
                src={post.imageUrl}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, 800px"
                className="object-cover"
              />
            </div>
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
                    <div className="relative aspect-video w-full">
                      <Image
                        src={related.imageUrl}
                        alt={related.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 50vw"
                        className="object-cover"
                      />
                    </div>
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
