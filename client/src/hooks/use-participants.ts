import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type ParticipantInput, type ParticipantsListResponse } from "@shared/routes";

function parseWithLogging<T>(schema: any, data: unknown, label: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error(`[Zod] ${label} validation failed:`, result.error.format());
    throw result.error;
  }
  return result.data as T;
}

export function useParticipants() {
  return useQuery({
    queryKey: [api.participants.list.path],
    queryFn: async () => {
      const res = await fetch(api.participants.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch participants");
      const data = await res.json();
      return parseWithLogging<ParticipantsListResponse>(
        api.participants.list.responses[200], 
        data, 
        "participants.list"
      );
    },
  });
}

export function useCreateParticipant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: ParticipantInput) => {
      const validated = api.participants.create.input.parse(data);
      const res = await fetch(api.participants.create.path, {
        method: api.participants.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      if (!res.ok) {
        throw new Error("Failed to save participant result");
      }
      
      const responseData = await res.json();
      return parseWithLogging(
        api.participants.create.responses[201], 
        responseData, 
        "participants.create"
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.participants.list.path] });
    },
  });
}
