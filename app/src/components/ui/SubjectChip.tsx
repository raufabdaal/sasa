import { cn } from "@/lib/cn";
import { subjectCode, type SubjectCode } from "@/lib/subjects";

/**
 * Subject identification chip — colored dot + label.
 * Replaces the v1 mono-uppercase Pill for subjects.
 * (Pill stays for non-subject labels like dates, status, etc.)
 */
export function SubjectChip({
  subject,
  grade,
  className,
}: {
  subject: string;
  grade?: string;
  className?: string;
}) {
  const code = subjectCode(subject);
  return (
    <span
      data-subj={code}
      className={cn("subj-chip", className)}
    >
      <span className="subj-dot" />
      <span>
        {subject}
        {grade ? ` · ${grade}` : ""}
      </span>
    </span>
  );
}

/** Just the dot, for compact contexts. */
export function SubjectDot({
  subject,
  className,
}: {
  subject: string | SubjectCode;
  className?: string;
}) {
  const code = (subject in {chem:1,bio:1,kis:1,ict:1,hist:1,math:1,eng:1,all:1})
    ? (subject as SubjectCode)
    : subjectCode(subject as string);
  return <span data-subj={code} className={cn("subj-dot", className)} />;
}
