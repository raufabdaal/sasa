import { cn } from "@/lib/cn";

/**
 * Mono uppercase label used for subject/grade/source pills.
 * Restraint: never use color to convey subject — just type.
 */
export function Pill({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-mono text-[10px] tracking-[0.14em] uppercase",
        "text-ink-2 bg-paper-2 rounded px-2 py-1",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function NewDot({ className }: { className?: string }) {
  return (
    <span
      aria-label="New"
      className={cn("inline-block h-[7px] w-[7px] rounded-full bg-ink", className)}
    />
  );
}
