/**
 * SEC EDGAR fair-use 정책에 따라 10 req/sec 미만으로 호출하기 위한
 * 단일 프로세스 in-memory 한도. 운영 환경에서 멀티 인스턴스를 사용할 경우
 * Redis 기반으로 교체할 수 있도록 별도 파일로 분리합니다.
 */

const MAX_PER_SECOND = 8; // 10 req/sec 정책 대비 안전 여유
const WINDOW_MS = 1000;

let timestamps: number[] = [];

function trim(now: number) {
  const cutoff = now - WINDOW_MS;
  while (timestamps.length && timestamps[0] < cutoff) timestamps.shift();
}

export async function acquireSecSlot(): Promise<void> {
  // 호출 직전에 슬롯이 비어있는지 확인하고, 가득 차 있으면 다음 윈도우로 대기.
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const now = Date.now();
    trim(now);
    if (timestamps.length < MAX_PER_SECOND) {
      timestamps.push(now);
      return;
    }
    const oldest = timestamps[0];
    const waitMs = Math.max(0, oldest + WINDOW_MS - now) + 10;
    await new Promise((r) => setTimeout(r, waitMs));
  }
}

export function _resetSecRateLimitForTest() {
  timestamps = [];
}
