import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const participants = pgTable("participants", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  experienceYears: integer("experience_years").notNull(),
  domain: text("domain").notNull(),
  resultType: text("result_type").notNull(),
});

export const insertParticipantSchema = createInsertSchema(participants).omit({ id: true });

export type Participant = typeof participants.$inferSelect;
export type InsertParticipant = z.infer<typeof insertParticipantSchema>;
