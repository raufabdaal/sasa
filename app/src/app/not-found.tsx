import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-dvh grid place-items-center px-6 bg-cream">
      <div className="text-center">
        <p className="font-serif text-[22px] text-ink max-w-[34ch] mx-auto leading-[1.3]">
          That page is not in this term's syllabus.
        </p>
        <Link
          href="/feed"
          className="btn btn-primary mt-7 inline-flex"
        >
          Back to the Feed
        </Link>
      </div>
    </div>
  );
}
