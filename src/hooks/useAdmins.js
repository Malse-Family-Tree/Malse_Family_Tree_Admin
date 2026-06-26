import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/constants";
import { adminService } from "@/services/admin.service";

export function useAdmins() {
  return useQuery({
    queryKey: [QUERY_KEYS.ADMINS],
    queryFn: async () => {
      const response = await adminService.getAll();
      return response.data;
    },
  });
}

export function useAdminMutations() {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMINS] });

  const createAdmin = useMutation({
    mutationFn: (payload) => adminService.create(payload),
    onSuccess: invalidate,
  });

  const updateAdmin = useMutation({
    mutationFn: ({ id, payload }) => adminService.update(id, payload),
    onSuccess: invalidate,
  });

  const deleteAdmin = useMutation({
    mutationFn: (id) => adminService.remove(id),
    onSuccess: invalidate,
  });

  const bulkDeleteAdmins = useMutation({
    mutationFn: (ids) => adminService.bulkRemove(ids),
    onSuccess: invalidate,
  });

  return { createAdmin, updateAdmin, deleteAdmin, bulkDeleteAdmins };
}
