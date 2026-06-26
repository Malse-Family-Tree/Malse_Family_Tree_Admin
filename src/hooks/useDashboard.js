import { useQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/constants";
import { dashboardService } from "@/services/dashboard.service";

export function useDashboardStats() {
  return useQuery({
    queryKey: [QUERY_KEYS.DASHBOARD],
    queryFn: async () => {
      const response = await dashboardService.getStats();
      return response.data;
    },
    refetchInterval: 60000,
  });
}
