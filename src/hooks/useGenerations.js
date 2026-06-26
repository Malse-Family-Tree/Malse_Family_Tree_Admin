import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/constants";
import { generationsService } from "@/services/generations.service";

export function useGenerations() {
  return useQuery({
    queryKey: [QUERY_KEYS.GENERATIONS],
    queryFn: async () => {
      const response = await generationsService.getAll();
      return response.data;
    },
  });
}

export function useGenerationMutations() {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GENERATIONS] });

  const createGeneration = useMutation({
    mutationFn: (payload) => generationsService.create(payload),
    onSuccess: invalidate,
  });

  const updateGeneration = useMutation({
    mutationFn: ({ id, payload }) => generationsService.update(id, payload),
    onSuccess: invalidate,
  });

  const deleteGeneration = useMutation({
    mutationFn: (id) => generationsService.remove(id),
    onSuccess: invalidate,
  });

  const bulkDeleteGenerations = useMutation({
    mutationFn: (ids) => generationsService.bulkRemove(ids),
    onSuccess: invalidate,
  });

  return { createGeneration, updateGeneration, deleteGeneration, bulkDeleteGenerations };
}

export function formatGenerationLabel(generation) {
  return `${generation.number} - ${generation.name}`;
}
