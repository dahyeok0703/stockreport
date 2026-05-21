import { ReactNode } from "react";

interface ReportSectionProps {
  id?: string;
  label: string;
  title: string;
  description?: string;
  children: ReactNode;
}

export default function ReportSection({
  id,
  label,
  title,
  description,
  children,
}: ReportSectionProps) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="mb-4 flex items-baseline gap-3">
        <span className="inline-flex h-7 min-w-[28px] items-center justify-center rounded-md bg-brand-700 px-2 text-xs font-bold uppercase text-white">
          {label}
        </span>
        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
          {title}
        </h2>
      </div>
      {description && (
        <p className="mb-4 text-sm leading-6 text-slate-600">{description}</p>
      )}
      <div className="space-y-4">{children}</div>
    </section>
  );
}
