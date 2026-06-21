import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Volume2, Bookmark, ChevronLeft } from "lucide-react";
import { TopBar, BackButton } from "@/components/shell/TopBar";
import { SubjectChip } from "@/components/ui/SubjectChip";
import { Diff } from "@/components/brief/Diff";
import { Markdown } from "@/components/brief/Markdown";
import { ComingSoonAction } from "@/components/brief/ComingSoonAction";
import { getAllUpdates, getUpdateBySlug } from "@/lib/content/loader";

export function generateStaticParams() {
  return getAllUpdates().map((u) => ({ slug: u.slug }));
}

export default async function BriefPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const update = getUpdateBySlug(slug);
  if (!update) notFound();

  const effective = new Date(update.effectiveDate).toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden">
        <TopBar
          left={<BackButton href="/feed" />}
          center={null}
          right={
            <div className="flex items-center gap-1">
              <ComingSoonAction kind="listen" />
              <ComingSoonAction kind="save" />
            </div>
          }
        />
      </div>

      {/* Desktop: back button as a discrete tertiary link above content */}
      <div className="hidden lg:block max-w-[1100px] mx-auto px-10 pt-10">
        <Link
          href="/feed"
          className="inline-flex items-center gap-1.5 text-[13.5px] text-ink-3 hover:text-ink transition-colors"
        >
          <ChevronLeft className="h-4 w-4" strokeWidth={1.6} />
          Back to Feed
        </Link>
      </div>

      <div className="lg:grid lg:grid-cols-[1fr_var(--rail-w)] lg:gap-12 max-w-[1100px] mx-auto px-5 lg:px-10 pt-6 lg:pt-6 pb-12">
        {/* Main column */}
        <article className="min-w-0 max-w-[640px] lg:max-w-none">
          <SubjectChip
            subject={update.subjects[0]}
            grade={update.grades.join(", ")}
          />

          <h1 className="font-serif text-[32px] sm:text-[36px] lg:text-[44px] leading-[1.08] font-medium text-ink mt-4 lg:mt-5 tracking-[-0.02em]">
            {update.title}
          </h1>

          <p className="mt-4 text-[13px] lg:text-[14px] text-ink-3">
            Effective {effective} · {update.source.docTitle}
            {update.reviewer ? ` · Reviewed by ${update.reviewer}` : ""}
          </p>

          <hr className="my-7 lg:my-9" style={{ border: "none", borderTop: "0.5px solid var(--line)" }} />

          <Markdown source={update.body} />

          <h2 className="font-serif font-medium text-[22px] lg:text-[26px] text-ink mt-10 lg:mt-14 mb-3 tracking-[-0.005em]">
            What changed
          </h2>
          <Diff before={update.diffBefore} after={update.diffAfter} />
          <p className="font-serif text-[16px] lg:text-[17px] text-ink-2 italic leading-[1.65] mt-4">
            {update.diffRationale}
          </p>

          {/* CTA */}
          <div className="mt-10 lg:mt-14 pt-8 lg:pt-10" style={{ borderTop: "0.5px solid var(--line)" }}>
            <p className="text-[15px] text-ink-2 mb-4">
              You've got it. Now apply it.
            </p>
            <Link
              href={`/feed/${update.slug}/sandbox`}
              className="btn btn-primary w-full lg:w-auto"
            >
              Try it in the Sandbox
              <ArrowRight className="h-4 w-4" strokeWidth={2.25} />
            </Link>

            <p className="font-mono text-[11px] text-ink-3 mt-6 leading-[1.5]">
              Drafted by AI from the official source. Reviewed by{" "}
              {update.reviewer ?? "the Sasa editorial team"}. AI contribution:{" "}
              {update.aiContribution.toFixed(1)}.
            </p>
          </div>
        </article>

        {/* Desktop right rail — sticky metadata + actions (DEV-007) */}
        <aside className="hidden lg:block">
          <div className="sticky top-10 space-y-5">
            <div className="card p-5">
              <div className="text-[10px] font-mono tracking-[0.16em] uppercase text-ink-3 font-semibold mb-3">
                This Brief
              </div>
              <dl className="space-y-3 text-[13px]">
                <div>
                  <dt className="text-ink-3 mb-0.5">Reading time</dt>
                  <dd className="text-ink font-medium">{update.estimatedReadMinutes} minutes</dd>
                </div>
                <div>
                  <dt className="text-ink-3 mb-0.5">Effective</dt>
                  <dd className="text-ink font-medium">{effective}</dd>
                </div>
                <div>
                  <dt className="text-ink-3 mb-0.5">Issued by</dt>
                  <dd className="text-ink font-medium">{update.source.publisher}</dd>
                </div>
                <div>
                  <dt className="text-ink-3 mb-0.5">Affects</dt>
                  <dd className="text-ink font-medium">
                    {update.subjects.join(", ")} · {update.grades.join(", ")}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="card p-5">
              <div className="text-[10px] font-mono tracking-[0.16em] uppercase text-ink-3 font-semibold mb-3">
                Actions
              </div>
              <div className="flex items-center gap-2.5 text-[13.5px] text-ink-3 py-1.5">
                <Volume2 className="h-4 w-4" strokeWidth={1.6} />
                Listen instead
                <span className="ml-auto text-[11px] font-mono">Soon</span>
              </div>
              <div className="flex items-center gap-2.5 text-[13.5px] text-ink-3 py-1.5">
                <Bookmark className="h-4 w-4" strokeWidth={1.6} />
                Save for later
                <span className="ml-auto text-[11px] font-mono">Soon</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
