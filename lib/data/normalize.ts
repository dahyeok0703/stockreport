/**
 * 외부 API 응답을 스톡리포트 내부 normalized 타입으로 변환.
 * 숫자는 원본 값만 사용하고, 해석·판단은 추가하지 않습니다.
 */

import {
  dartViewerUrl,
  type DartAccountItem,
  type DartListItem,
} from "@/lib/providers/opendart";
import {
  buildSecPrimaryDocUrl,
  IMPORTANT_SEC_FORMS,
  pickLatestUsdFact,
  type SecCompanyFactsResponse,
  type SecSubmissionsResponse,
} from "@/lib/providers/sec";
import type {
  NormalizedEarnings,
  NormalizedFiling,
  NormalizedFinancialMetric,
  NormalizedNewsItem,
} from "@/lib/providers/types";

function fmtDartDate(yyyymmdd: string): string {
  if (!yyyymmdd || yyyymmdd.length !== 8) return yyyymmdd;
  return `${yyyymmdd.slice(0, 4)}-${yyyymmdd.slice(4, 6)}-${yyyymmdd.slice(6, 8)}`;
}

function parseDartAmount(raw: string | undefined | null): number | null {
  if (!raw) return null;
  const cleaned = raw.replace(/[,\s]/g, "");
  if (!cleaned || cleaned === "-") return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

function formatKrwAmount(amount: number): string {
  // 단위: 원 → 조/억 단위 표기
  const abs = Math.abs(amount);
  if (abs >= 1e12) return `${(amount / 1e12).toFixed(2)}조 원`;
  if (abs >= 1e8) return `${(amount / 1e8).toFixed(1)}억 원`;
  return new Intl.NumberFormat("ko-KR").format(amount) + " 원";
}

function formatUsdAmount(amount: number): string {
  const abs = Math.abs(amount);
  if (abs >= 1e9) return `$${(amount / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `$${(amount / 1e6).toFixed(2)}M`;
  if (abs >= 1e3) return `$${(amount / 1e3).toFixed(1)}K`;
  return `$${amount.toFixed(0)}`;
}

// =================================================================
// OpenDART
// =================================================================

export function normalizeDartDisclosure(raw: DartListItem): NormalizedFiling {
  return {
    id: `dart-${raw.rcept_no}`,
    title: raw.report_nm?.trim() ?? "(제목 없음)",
    formType: classifyDartReport(raw.report_nm ?? ""),
    filingDate: fmtDartDate(raw.rcept_dt),
    reportDate: null,
    source: "opendart",
    sourceUrl: dartViewerUrl(raw.rcept_no),
    rawSummary: null,
    importantFields: [
      { label: "접수번호", value: raw.rcept_no },
      { label: "제출인", value: raw.flr_nm ?? "—" },
    ].filter((f) => f.value && f.value !== "—"),
  };
}

function classifyDartReport(reportNm: string): string {
  if (/사업보고서/.test(reportNm)) return "사업보고서";
  if (/반기보고서/.test(reportNm)) return "반기보고서";
  if (/분기보고서/.test(reportNm)) return "분기보고서";
  if (/주요사항보고서/.test(reportNm)) return "주요사항보고서";
  if (/감사보고서/.test(reportNm)) return "감사보고서";
  if (/자기주식|자사주/.test(reportNm)) return "자기주식";
  if (/배당/.test(reportNm)) return "배당";
  return "공시";
}

const DART_PRIORITY_ACCOUNTS = [
  { match: /매출액/, label: "매출" },
  { match: /^매출$/, label: "매출" },
  { match: /영업이익/, label: "영업이익" },
  { match: /당기순이익/, label: "순이익" },
  { match: /자산총계/, label: "총자산" },
  { match: /부채총계/, label: "총부채" },
  { match: /자본총계/, label: "총자본" },
];

export function normalizeDartFinancials(
  raw: DartAccountItem[],
): NormalizedFinancialMetric[] {
  // 연결재무제표(CFS) 우선, 없으면 OFS(별도재무제표)
  const consolidated = raw.filter((r) =>
    /연결/.test(r.sj_nm) || r.sj_div === "BS" || r.sj_div === "IS",
  );
  const source = consolidated.length ? consolidated : raw;

  const result: NormalizedFinancialMetric[] = [];
  for (const rule of DART_PRIORITY_ACCOUNTS) {
    const match = source.find(
      (r) => rule.match.test(r.account_nm) && parseDartAmount(r.thstrm_amount) !== null,
    );
    if (!match) continue;
    const amount = parseDartAmount(match.thstrm_amount);
    if (amount === null) continue;
    // Skip duplicates
    if (result.some((m) => m.label === rule.label)) continue;
    result.push({
      label: rule.label,
      value: formatKrwAmount(amount),
      unit: "KRW",
      period: `${match.bsns_year} ${match.thstrm_nm ?? ""}`.trim(),
      source: "opendart",
      rawName: match.account_nm,
    });
  }
  return result;
}

export function deriveDartEarnings(
  raw: DartAccountItem[],
): NormalizedEarnings | null {
  if (!raw.length) return null;
  const findAccount = (re: RegExp) =>
    raw.find(
      (r) =>
        re.test(r.account_nm) &&
        (parseDartAmount(r.thstrm_amount) !== null ||
          parseDartAmount(r.thstrm_add_amount) !== null),
    );
  const revenueRow = findAccount(/매출액|^매출$/);
  const opRow = findAccount(/영업이익/);
  const niRow = findAccount(/당기순이익/);
  if (!revenueRow && !opRow && !niRow) return null;

  const period = revenueRow
    ? `${revenueRow.bsns_year} ${revenueRow.thstrm_nm ?? ""}`.trim()
    : opRow
      ? `${opRow.bsns_year} ${opRow.thstrm_nm ?? ""}`.trim()
      : "—";

  function toMetric(
    row: DartAccountItem | undefined,
    label: string,
  ): NormalizedFinancialMetric | null {
    if (!row) return null;
    const v =
      parseDartAmount(row.thstrm_amount) ??
      parseDartAmount(row.thstrm_add_amount);
    if (v === null) return null;
    return {
      label,
      value: formatKrwAmount(v),
      unit: "KRW",
      period: `${row.bsns_year} ${row.thstrm_nm ?? ""}`.trim(),
      source: "opendart",
      rawName: row.account_nm,
    };
  }

  return {
    period,
    revenue: toMetric(revenueRow, "매출"),
    operatingProfit: toMetric(opRow, "영업이익"),
    netProfit: toMetric(niRow, "순이익"),
  };
}

// =================================================================
// SEC
// =================================================================

export function normalizeSecFilings(
  sub: SecSubmissionsResponse,
  cik: string,
  limit = 10,
): NormalizedFiling[] {
  const recent = sub.filings?.recent;
  if (!recent) return [];
  const len = Math.min(
    recent.accessionNumber?.length ?? 0,
    recent.form?.length ?? 0,
  );
  const out: NormalizedFiling[] = [];
  for (let i = 0; i < len; i++) {
    const form = recent.form[i];
    if (!IMPORTANT_SEC_FORMS.has(form)) continue;
    const accession = recent.accessionNumber[i];
    const primaryDoc = recent.primaryDocument?.[i] ?? "";
    out.push({
      id: `sec-${accession}`,
      title:
        recent.primaryDocDescription?.[i]?.trim() || `${form} filing`,
      formType: form,
      filingDate: recent.filingDate[i],
      reportDate: recent.reportDate?.[i] ?? null,
      source: "sec",
      sourceUrl: primaryDoc
        ? buildSecPrimaryDocUrl(cik, accession, primaryDoc)
        : `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=${parseInt(cik, 10)}&type=&dateb=&owner=include&count=40`,
      rawSummary: null,
      importantFields: [
        { label: "Accession", value: accession },
      ],
    });
    if (out.length >= limit) break;
  }
  return out;
}

const SEC_TAG_GROUPS = [
  {
    label: "Revenue",
    period: "최근 분기",
    tags: [
      "Revenues",
      "RevenueFromContractWithCustomerExcludingAssessedTax",
      "SalesRevenueNet",
    ],
  },
  {
    label: "Operating Income",
    period: "최근 분기",
    tags: ["OperatingIncomeLoss"],
  },
  {
    label: "Net Income",
    period: "최근 분기",
    tags: ["NetIncomeLoss"],
  },
  {
    label: "Total Assets",
    period: "최근 보고",
    tags: ["Assets"],
  },
  {
    label: "Total Liabilities",
    period: "최근 보고",
    tags: ["Liabilities"],
  },
  {
    label: "Cash from Operations",
    period: "최근 보고",
    tags: ["NetCashProvidedByUsedInOperatingActivities"],
  },
];

export function normalizeSecCompanyFacts(
  facts: SecCompanyFactsResponse,
): NormalizedFinancialMetric[] {
  const out: NormalizedFinancialMetric[] = [];
  for (const group of SEC_TAG_GROUPS) {
    const picked = pickLatestUsdFact(facts.facts, group.tags);
    if (!picked) continue;
    out.push({
      label: group.label,
      value: formatUsdAmount(picked.entry.val),
      unit: "USD",
      period: `${picked.entry.fy ?? ""} ${picked.entry.fp ?? ""}`.trim(),
      source: "sec",
      rawName: picked.tag,
    });
  }
  return out;
}

export function deriveSecEarnings(
  facts: SecCompanyFactsResponse,
): NormalizedEarnings | null {
  const revenue = pickLatestUsdFact(facts.facts, [
    "Revenues",
    "RevenueFromContractWithCustomerExcludingAssessedTax",
    "SalesRevenueNet",
  ]);
  const op = pickLatestUsdFact(facts.facts, ["OperatingIncomeLoss"]);
  const ni = pickLatestUsdFact(facts.facts, ["NetIncomeLoss"]);
  if (!revenue && !op && !ni) return null;
  const period =
    revenue?.entry.fy && revenue?.entry.fp
      ? `FY${revenue.entry.fy} ${revenue.entry.fp}`
      : "최근 보고 기간";

  const toMetric = (
    picked: ReturnType<typeof pickLatestUsdFact>,
    label: string,
  ): NormalizedFinancialMetric | null => {
    if (!picked) return null;
    return {
      label,
      value: formatUsdAmount(picked.entry.val),
      unit: "USD",
      period: `${picked.entry.fy ?? ""} ${picked.entry.fp ?? ""}`.trim(),
      source: "sec",
      rawName: picked.tag,
    };
  };

  return {
    period,
    revenue: toMetric(revenue, "Revenue"),
    operatingProfit: toMetric(op, "Operating Income"),
    netProfit: toMetric(ni, "Net Income"),
  };
}

// =================================================================
// News (provider별 정규화는 lib/providers/news.ts에서 이미 처리)
// =================================================================
export function ensureNewsShape(
  raw: NormalizedNewsItem[],
): NormalizedNewsItem[] {
  return raw
    .filter((n) => n && n.title && n.url)
    .map((n) => ({
      ...n,
      summary: n.summary && n.summary.length > 240
        ? n.summary.slice(0, 240) + "…"
        : n.summary,
    }));
}
