export interface PricingPlan {
  name: string;
  price: string;
  priceNote?: string;
  description: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
}

interface PricingCardProps {
  plan: PricingPlan;
}

export default function PricingCard({ plan }: PricingCardProps) {
  return (
    <article
      className={`flex flex-col rounded-2xl border p-6 ${
        plan.highlighted
          ? "border-brand-700 bg-brand-700 text-white shadow-cardHover"
          : "border-slate-200 bg-white shadow-card"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <h3
          className={`text-lg font-bold ${
            plan.highlighted ? "text-white" : "text-slate-900"
          }`}
        >
          {plan.name}
        </h3>
        {plan.highlighted && (
          <span className="rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium">
            가장 인기
          </span>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-1">
        <span
          className={`text-3xl font-bold ${
            plan.highlighted ? "text-white" : "text-slate-900"
          }`}
        >
          {plan.price}
        </span>
        {plan.priceNote && (
          <span
            className={`text-sm ${
              plan.highlighted ? "text-white/80" : "text-slate-500"
            }`}
          >
            {plan.priceNote}
          </span>
        )}
      </div>

      <p
        className={`mt-2 text-sm ${
          plan.highlighted ? "text-white/85" : "text-slate-600"
        }`}
      >
        {plan.description}
      </p>

      <ul className="mt-5 space-y-2.5">
        {plan.features.map((f) => (
          <li
            key={f}
            className={`flex items-start gap-2 text-sm leading-6 ${
              plan.highlighted ? "text-white/95" : "text-slate-700"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`mt-0.5 h-4 w-4 flex-shrink-0 ${
                plan.highlighted ? "text-white" : "text-brand-700"
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        disabled
        className={`mt-6 w-full rounded-md px-4 py-2.5 text-sm font-medium ${
          plan.highlighted
            ? "bg-white text-brand-800 hover:bg-slate-100"
            : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
        }`}
      >
        {plan.cta}
      </button>
    </article>
  );
}
