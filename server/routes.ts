import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

async function seedDatabase() {
  try {
    const existing = await storage.getParticipants();
    if (existing.length === 0) {
      console.log("Seeding database with mock participants...");
      const mockData = [
        { name: "Alice", experienceYears: 3, domain: "프론트엔드", resultType: "exchange" },
        { name: "Bob", experienceYears: 5, domain: "백엔드", resultType: "growth" },
        { name: "Charlie", experienceYears: 1, domain: "AI/ML", resultType: "challenge" },
        { name: "Dave", experienceYears: 7, domain: "데이터", resultType: "network" },
        { name: "Eve", experienceYears: 2, domain: "게임 클라이언트", resultType: "record" },
      ];
      for (const p of mockData) {
        await storage.createParticipant(p);
      }
      console.log("Database seeded successfully.");
    }
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Seed database on startup
  seedDatabase();

  app.get(api.participants.list.path, async (req, res) => {
    const data = await storage.getParticipants();
    res.json(data);
  });

  app.post(api.participants.create.path, async (req, res) => {
    try {
      const input = api.participants.create.input.parse(req.body);
      const participant = await storage.createParticipant(input);
      res.status(201).json(participant);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  return httpServer;
}