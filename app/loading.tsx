export default function Loading() {
  return (
    <div className="container-page py-16">
      <div className="mx-auto max-w-md text-center">
        <div className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-card">
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-brand-600" />
          <span className="text-sm text-slate-600">불러오는 중…</span>
        </div>
      </div>
    </div>
  );
}
