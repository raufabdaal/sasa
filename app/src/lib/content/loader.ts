import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { CurriculumUpdate, CurriculumUpdateFrontmatter } from "./types";

/**
 * Reads every .mdx file in /content/updates and returns the parsed updates.
 * Runs at build time (server-only). Do not import from client components.
 */

/**
 * Content lives at the workspace root: ../content/updates (relative to app/).
 * This keeps Briefs editable without touching application code.
 *
 * Why ../? The Next.js app runs from /sasa/app, content lives at /sasa/content.
 */
const CONTENT_DIR = path.resolve(process.cwd(), "..", "content", "updates");

let cache: CurriculumUpdate[] | null = null;

export function getAllUpdates(): CurriculumUpdate[] {
  if (cache) return cache;

  if (!fs.existsSync(CONTENT_DIR)) {
    console.warn(`[content] Directory not found: ${CONTENT_DIR}`);
    cache = [];
    return cache;
  }

  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".mdx"));

  const updates: CurriculumUpdate[] = files.map((file) => {
    const full = path.join(CONTENT_DIR, file);
    const raw = fs.readFileSync(full, "utf8");
    const { data, content } = matter(raw);
    return {
      ...(data as CurriculumUpdateFrontmatter),
      body: content,
    };
  });

  // Sort newest first by publishedAt
  updates.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );

  cache = updates;
  return cache;
}

export function getUpdateBySlug(slug: string): CurriculumUpdate | undefined {
  return getAllUpdates().find((u) => u.slug === slug);
}
