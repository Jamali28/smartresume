import {
  users,
  resumes,
  coverLetters,
  type User,
  type UpsertUser,
  type Resume,
  type InsertResume,
  type CoverLetter,
  type InsertCoverLetter,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Resume operations
  createResume(resume: InsertResume): Promise<Resume>;
  getResume(id: string): Promise<Resume | undefined>;
  getUserResumes(userId: string): Promise<Resume[]>;
  updateResume(id: string, resume: Partial<InsertResume>): Promise<Resume>;
  deleteResume(id: string): Promise<void>;
  
  // Cover letter operations
  createCoverLetter(coverLetter: InsertCoverLetter): Promise<CoverLetter>;
  getCoverLetter(resumeId: string): Promise<CoverLetter | undefined>;
  updateCoverLetter(id: string, content: string): Promise<CoverLetter>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Resume operations
  async createResume(resume: InsertResume): Promise<Resume> {
    const [newResume] = await db
      .insert(resumes)
      .values(resume)
      .returning();
    return newResume;
  }

  async getResume(id: string): Promise<Resume | undefined> {
    const [resume] = await db
      .select()
      .from(resumes)
      .where(eq(resumes.id, id));
    return resume;
  }

  async getUserResumes(userId: string): Promise<Resume[]> {
    return await db
      .select()
      .from(resumes)
      .where(eq(resumes.userId, userId))
      .orderBy(desc(resumes.updatedAt));
  }

  async updateResume(id: string, resume: Partial<InsertResume>): Promise<Resume> {
    const [updatedResume] = await db
      .update(resumes)
      .set({ ...resume, updatedAt: new Date() })
      .where(eq(resumes.id, id))
      .returning();
    return updatedResume;
  }

  async deleteResume(id: string): Promise<void> {
    await db.delete(resumes).where(eq(resumes.id, id));
  }

  // Cover letter operations
  async createCoverLetter(coverLetter: InsertCoverLetter): Promise<CoverLetter> {
    const [newCoverLetter] = await db
      .insert(coverLetters)
      .values(coverLetter)
      .returning();
    return newCoverLetter;
  }

  async getCoverLetter(resumeId: string): Promise<CoverLetter | undefined> {
    const [coverLetter] = await db
      .select()
      .from(coverLetters)
      .where(eq(coverLetters.resumeId, resumeId))
      .orderBy(desc(coverLetters.createdAt));
    return coverLetter;
  }

  async updateCoverLetter(id: string, content: string): Promise<CoverLetter> {
    const [updatedCoverLetter] = await db
      .update(coverLetters)
      .set({ content })
      .where(eq(coverLetters.id, id))
      .returning();
    return updatedCoverLetter;
  }
}

export const storage = new DatabaseStorage();
