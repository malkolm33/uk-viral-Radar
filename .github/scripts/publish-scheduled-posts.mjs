// Flips any "scheduled" blog post in app/lib/blog-posts.ts to "published"
// once its publishDate has arrived (or passed).
//
// This intentionally does NOT parse the file as TypeScript/JSON - it does a
// simple, safe text substitution that only matches the exact
// `status: "scheduled",` followed by `publishDate: "YYYY-MM-DD",` pattern
// that every post in this file is written with. As long as new posts are
// added following the format shown in README-BLOG.md, this keeps working
// without needing any extra build tooling in this workflow.

import { readFileSync, writeFileSync } from "node:fs";

const filePath = "app/lib/blog-posts.ts";

const source = readFileSync(filePath, "utf8");

// Compare by calendar date only (UTC), never by time of day - this avoids
// any timezone edge cases between UK time and the UTC clock GitHub Actions
// and Vercel both run on.
const todayIso = new Date().toISOString().slice(0, 10);

const scheduledPostPattern = /status:\s*"scheduled",(\s*)publishDate:\s*"(\d{4}-\d{2}-\d{2})",/g;

let publishedCount = 0;

const updated = source.replace(scheduledPostPattern, (match, whitespace, publishDate) => {
  if (publishDate <= todayIso) {
    publishedCount += 1;
    return `status: "published",${whitespace}publishDate: "${publishDate}",`;
  }
  return match;
});

if (publishedCount > 0) {
  writeFileSync(filePath, updated, "utf8");
  console.log(`Published ${publishedCount} scheduled post(s) due on or before ${todayIso}.`);
} else {
  console.log(`No scheduled posts are due yet (today is ${todayIso}).`);
}
