import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { CurriculumUpdate, CurriculumUpdateFrontmatter } from "./types";

/**
 * Loads every .mdx file in /content/updates at build time.
 *
 * Robust to deployment quirks:
 *  - Local dev: app/ runs from /sasa/app, content is at /sasa/content
 *  - Vercel: build runs in /vercel/path0/app, content is at /vercel/path0/content
 *    (only works if "Include files outside Root Directory" is enabled)
 *
 * We try several candidate paths in order and use the first one that exists.
 * If none exist, we throw loudly during build so we never silently ship an
 * empty Feed again.
 */

const CANDIDATE_DIRS = [
  // Standard: one level up from the Next.js app root
  path.resolve(process.cwd(), "..", "content", "updates"),
  // Vercel fallback: project root
  path.resolve(process.cwd(), "content", "updates"),
  // Inside-app fallback (if we ever move content)
  path.resolve(process.cwd(), "src", "content", "updates"),
];

function resolveContentDir(): string {
  for (const dir of CANDIDATE_DIRS) {
    if (fs.existsSync(dir)) return dir;
  }

  // Loud, helpful failure that breaks the build instead of producing an empty Feed.
  const tried = CANDIDATE_DIRS.map((d) => `  - ${d}`).join("\n");
  throw new Error(
    `[content] No content directory found. Tried:\n${tried}\n\n` +
      `On Vercel: ensure Settings > General > Root Directory has ` +
      `"Include source files outside of the Root Directory in the Build Step" enabled, ` +
      `so the sibling /content folder is available to the build.`,
  );
}

let cache: CurriculumUpdate[] | null = null;

export function getAllUpdates(): CurriculumUpdate[] {
  if (cache) return cache;

  const contentDir = resolveContentDir();
  const files = fs.readdirSync(contentDir).filter((f) => f.endsWith(".mdx"));

  if (files.length === 0) {
    throw new Error(
      `[content] Content directory found at ${contentDir} but it contains no .mdx files.`,
    );
  }

  const updates: CurriculumUpdate[] = files.map((file) => {
    const full = path.join(contentDir, file);
    const raw = fs.readFileSync(full, "utf8");
    const { data, content } = matter(raw);
    return {
      ...(data as CurriculumUpdateFrontmatter),
      body: content,
    };
  });

  // Newest first by publishedAt
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
