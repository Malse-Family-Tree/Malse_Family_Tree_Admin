import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/constants";
import { membersService } from "@/services/members.service";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

export function useMembers(searchQuery = "") {
  const debouncedQuery = useDebouncedValue(searchQuery, 300);
  const normalizedQuery = debouncedQuery.trim();
  const isSearching = normalizedQuery.length > 0;

  return useQuery({
    queryKey: [QUERY_KEYS.MEMBERS, normalizedQuery],
    queryFn: async () => {
      if (!isSearching) {
        const response = await membersService.getAll();
        return response.data;
      }

      const response = await membersService.search(normalizedQuery);
      return response.data;
    },
  });
}

export function useMemberMutations() {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MEMBERS] });

  const createMember = useMutation({
    mutationFn: (payload) => membersService.create(payload),
    onSuccess: invalidate,
  });

  const updateMember = useMutation({
    mutationFn: ({ id, payload }) => membersService.update(id, payload),
    onSuccess: invalidate,
  });

  const deleteMember = useMutation({
    mutationFn: (id) => membersService.remove(id),
    onSuccess: invalidate,
  });

  const bulkDeleteMembers = useMutation({
    mutationFn: (ids) => membersService.bulkRemove(ids),
    onSuccess: invalidate,
  });

  return { createMember, updateMember, deleteMember, bulkDeleteMembers };
}

export function useAllMembers(options = {}) {
  return useQuery({
    queryKey: [QUERY_KEYS.MEMBERS, "all"],
    queryFn: async () => {
      const response = await membersService.getAll();
      return response.data;
    },
    ...options,
  });
}
