/**
 * CurriculumUpdate — the universal shape every Brief conforms to.
 * Mirror of the DB schema in docs/data-architecture.md.
 *
 * In v0 we load these from MDX files at build time. In v1 they'll come from Postgres.
 */

export type Level = "O-Level" | "A-Level" | "Primary";
export type Construct = "Knowledge" | "Skill" | "Application" | "Values";
export type ChangeType =
  | "addition"
  | "removal"
  | "revision"
  | "clarification"
  | "assessment";

export type SandboxExerciseType =
  | "regrade"
  | "rewrite"
  | "plan_opener"
  | "design_aoi"
  | "identify_construct";

export interface SandboxExercise {
  id: string;
  type: SandboxExerciseType;
  prompt: string;
  reference?: string;
  rubric: {
    knowledge:   { weight: number; descriptor: string };
    skill:       { weight: number; descriptor: string };
    application: { weight: number; descriptor: string };
    values:      { weight: number; descriptor: string };
  };
  estimatedMinutes: number;
}

export interface CurriculumUpdateFrontmatter {
  slug: string;
  title: string;
  summary: string;

  level: Level;
  subjects: string[];
  grades: string[];
  constructs: Construct[];
  topics: string[];

  changeType: ChangeType;
  diffBefore?: string;
  diffAfter: string;
  diffRationale: string;

  source: {
    publisher: "NCDC" | "UNEB" | "MoES";
    docTitle: string;
    docUrl?: string;
    issuedDate: string; // ISO
  };

  effectiveDate: string; // ISO
  expiresDate?: string;

  estimatedReadMinutes: number;
  audioUrl?: string;

  sandboxExercises: SandboxExercise[];

  reviewer?: string;
  aiContribution: number; // 0–1
  publishedAt: string;    // ISO
}

export interface CurriculumUpdate extends CurriculumUpdateFrontmatter {
  body: string; // raw MDX body (without frontmatter)
}
