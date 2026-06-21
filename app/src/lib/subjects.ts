/**
 * Subject → short code mapping (used for CSS `data-subj` attribute).
 * Locked by DEV-005 in docs/spec/DESIGN_DEVIATIONS.md
 */

export type SubjectCode =
  | "chem" | "bio" | "kis" | "ict" | "hist" | "math" | "eng" | "all";

const map: Record<string, SubjectCode> = {
  "chemistry":     "chem",
  "biology":       "bio",
  "kiswahili":     "kis",
  "ict":           "ict",
  "history & political education": "hist",
  "history":       "hist",
  "mathematics":   "math",
  "math":          "math",
  "english":       "eng",
  "all":           "all",
  "all subjects":  "all",
};

export function subjectCode(name: string): SubjectCode {
  return map[name.toLowerCase().trim()] ?? "all";
}

/** Pick the primary subject color code for an array of subjects. */
export function primarySubjectCode(subjects: string[]): SubjectCode {
  if (!subjects.length) return "all";
  return subjectCode(subjects[0]);
}
