export default function SupabaseMissingBanner() {
  return (
    <div className="border-b border-amber-200 bg-amber-50">
      <div className="container-page py-2.5">
        <p className="text-xs leading-5 text-amber-900">
          <span className="font-semibold">개발자 안내</span> · Supabase 환경
          변수(<code className="rounded bg-amber-100 px-1">NEXT_PUBLIC_SUPABASE_URL</code>,{" "}
          <code className="rounded bg-amber-100 px-1">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>)가
          설정되지 않아 로그인·관심종목 저장 기능이 비활성화되었습니다. 화면은 목업
          데이터로 동작합니다.
        </p>
      </div>
    </div>
  );
}
