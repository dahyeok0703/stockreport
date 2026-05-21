// Back-compat re-exports. New code should import from "@/lib/config/env".
export {
  getSupabaseEnv,
  getSupabaseServiceRoleKey,
} from "@/lib/config/env";
export type { SupabaseEnv } from "@/lib/config/env";

import { getSupabaseEnv } from "@/lib/config/env";

export function hasSupabaseConfig(): boolean {
  return getSupabaseEnv() !== null;
}
