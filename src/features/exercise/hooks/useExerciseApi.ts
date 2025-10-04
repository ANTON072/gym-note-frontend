import { httpAuth } from "@/lib/httpAuth";
import {
  type UseMutationOptions,
  type UseQueryOptions,
  useMutation,
  useQuery,
} from "@tanstack/react-query";

import {
  QUERY_KEY_CREATE_EXERCISE,
  QUERY_KEY_DELETE_EXERCISE,
  QUERY_KEY_EXERCISES,
  QUERY_KEY_UPDATE_EXERCISE,
} from "../constants/queryKeys";
import type { Exercise, ExerciseFormData } from "../schema";

export const useGetExercises = (
  options?: Omit<UseQueryOptions<Exercise[], Error>, "queryKey" | "queryFn">,
) => {
  return useQuery<Exercise[], Error>({
    queryKey: [QUERY_KEY_EXERCISES],
    queryFn: async () => {
      return await httpAuth.get<Exercise[]>("/exercises");
    },
    ...options,
  });
};

export const useGetExercise = (
  exerciseId: number | null | undefined,
  options?: Omit<UseQueryOptions<Exercise, Error>, "queryKey" | "queryFn">,
) => {
  return useQuery<Exercise, Error>({
    queryKey: [QUERY_KEY_EXERCISES, exerciseId],
    queryFn: async () => {
      if (!exerciseId) {
        throw new Error("exerciseId is required");
      }
      return await httpAuth.get<Exercise>(`/exercises/${exerciseId}`);
    },
    ...options,
  });
};

export const useCreateExercise = (
  options?: UseMutationOptions<{ exercise: Exercise }, Error, ExerciseFormData>,
) => {
  return useMutation<{ exercise: Exercise }, Error, ExerciseFormData>({
    mutationKey: [QUERY_KEY_CREATE_EXERCISE],
    mutationFn: async (data: ExerciseFormData) => {
      return await httpAuth.post<{ exercise: Exercise }>("/exercises", data);
    },
    ...options,
  });
};

export const useUpdateExercise = (
  options?: UseMutationOptions<
    { exercise: Exercise },
    Error,
    { id: number; data: ExerciseFormData }
  >,
) => {
  return useMutation<{ exercise: Exercise }, Error, { id: number; data: ExerciseFormData }>({
    mutationKey: [QUERY_KEY_UPDATE_EXERCISE],
    mutationFn: async ({ id, data }) => {
      return await httpAuth.put<{ exercise: Exercise }>(`/exercises/${id}`, data);
    },
    ...options,
  });
};

export const useDeleteExercise = (options?: UseMutationOptions<void, Error, number>) => {
  return useMutation<void, Error, number>({
    mutationKey: [QUERY_KEY_DELETE_EXERCISE],
    mutationFn: async (exerciseId: number) => {
      return await httpAuth.delete<void>(`/exercises/${exerciseId}`);
    },
    ...options,
  });
};
