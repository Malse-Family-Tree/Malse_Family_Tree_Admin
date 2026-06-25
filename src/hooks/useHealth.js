import { useQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/constants";
import { healthService } from "@/services/health.service";

export function useBackendHealth() {
  return useQuery({
    queryKey: [QUERY_KEYS.HEALTH],
    queryFn: healthService.check,
    retry: 1,
    refetchInterval: 30000,
  });
}
