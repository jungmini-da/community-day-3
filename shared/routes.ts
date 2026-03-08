import { z } from 'zod';
import { insertParticipantSchema, participants } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  participants: {
    list: {
      method: 'GET' as const,
      path: '/api/participants' as const,
      responses: {
        200: z.array(z.custom<typeof participants.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/participants' as const,
      input: insertParticipantSchema,
      responses: {
        201: z.custom<typeof participants.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type ParticipantInput = z.infer<typeof api.participants.create.input>;
export type ParticipantResponse = z.infer<typeof api.participants.create.responses[201]>;
export type ParticipantsListResponse = z.infer<typeof api.participants.list.responses[200]>;
