import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { TopBar, BackButton } from "@/components/shell/TopBar";
import { SubjectChip } from "@/components/ui/SubjectChip";
import { SandboxClient } from "@/components/sandbox/SandboxClient";
import { getUpdateBySlug, getAllUpdates } from "@/lib/content/loader";

export function generateStaticParams() {
  return getAllUpdates().map((u) => ({ slug: u.slug }));
}

export default async function SandboxPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const update = getUpdateBySlug(slug);
  if (!update) notFound();

  return (
    <>
      <div className="lg:hidden">
        <TopBar
          left={<BackButton href={`/feed/${slug}`} />}
          center="Sandbox"
          right={
            <span className="font-mono text-[10.5px] tracking-[0.16em] text-ink-3 font-semibold">
              {update.sandboxExercises.length} STEPS
            </span>
          }
        />
      </div>

      <div className="hidden lg:block max-w-[760px] mx-auto px-10 pt-10">
        <Link
          href={`/feed/${slug}`}
          className="inline-flex items-center gap-1.5 text-[13.5px] text-ink-3 hover:text-ink transition-colors"
        >
          <ChevronLeft className="h-4 w-4" strokeWidth={1.6} />
          Back to Brief
        </Link>
      </div>

      <div className="px-5 lg:px-10 pt-5 lg:pt-6 pb-12 max-w-[760px] mx-auto">
        <SubjectChip subject={update.subjects[0]} grade={update.grades[0]} />
        <h1 className="font-serif text-[26px] lg:text-[34px] leading-[1.15] font-medium text-ink mt-3 lg:mt-4 mb-6 lg:mb-8 tracking-[-0.015em]">
          {update.title}
        </h1>

        <SandboxClient exercises={update.sandboxExercises} />
      </div>
    </>
  );
}
