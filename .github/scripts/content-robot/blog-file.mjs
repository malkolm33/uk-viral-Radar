// Reads and safely appends posts to app/lib/blog-posts.ts.
import { readFileSync, writeFileSync } from "node:fs";

export const BLOG_FILE = "app/lib/blog-posts.ts";

export function readBlogFile() {
  return readFileSync(BLOG_FILE, "utf8");
}

export function existingSlugs(source) {
  return [...source.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]);
}

export function postDates(source) {
  return [...source.matchAll(/\bdate:\s*"(\d{4}-\d{2}-\d{2})"/g)].map((m) => m[1]);
}

const str = (s) => JSON.stringify(String(s)); // double-quoted, fully escaped
// Template literal body: escape backslashes, backticks and "${".
const tpl = (s) => String(s).replace(/\r/g, "").replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");

export function appendPost(source, article, today) {
  const nl = source.includes("\r\n") ? "\r\n" : "\n";
  // Same field order as README-BLOG.md - publish-scheduled-posts.mjs relies on
  // `status:` being directly followed by `publishDate:`.
  const entry = [
    "  {",
    `    title: ${str(article.title)},`,
    `    slug: ${str(article.slug)},`,
    "    excerpt:",
    `      ${str(article.excerpt)},`,
    `    content: \`${tpl(article.content)}\`,`,
    `    date: "${today}",`,
    `    category: ${str(article.category || "Trends")},`,
    `    status: "published",`,
    `    publishDate: "${today}",`,
    `    imageUrl: "/blog-cover/${article.slug}",`,
    "  },",
  ].join("\n").replace(/\n/g, nl);

  const marker = source.indexOf("export const blogPosts");
  const close = source.indexOf(`${nl}];`, marker);
  if (marker === -1 || close === -1) throw new Error("Could not find the blogPosts array in blog-posts.ts");
  return source.slice(0, close) + nl + entry + source.slice(close);
}

export function writeBlogFile(source) {
  writeFileSync(BLOG_FILE, source, "utf8");
}
