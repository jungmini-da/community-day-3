import { db } from "./db";
import {
  participants,
  type Participant,
  type InsertParticipant
} from "@shared/schema";

export interface IStorage {
  getParticipants(): Promise<Participant[]>;
  createParticipant(participant: InsertParticipant): Promise<Participant>;
}

export class DatabaseStorage implements IStorage {
  async getParticipants(): Promise<Participant[]> {
    return await db.select().from(participants);
  }

  async createParticipant(insertParticipant: InsertParticipant): Promise<Participant> {
    const [participant] = await db.insert(participants).values(insertParticipant).returning();
    return participant;
  }
}

export const storage = new DatabaseStorage();