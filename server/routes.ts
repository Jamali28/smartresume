import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  insertResumeSchema, 
  insertCoverLetterSchema,
  resumeFormSchema,
  type ResumeForm 
} from "@shared/schema";
import { generateResumeContent, generateCoverLetter } from "./services/openai";
import { generateResumePDF } from "./services/pdf";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Resume routes
  app.post("/api/resumes", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const resumeData = resumeFormSchema.parse(req.body);
      
      let optimizedContent = resumeData;
      let matchScore = 0;

      // If job description is provided, optimize with AI
      if (resumeData.jobDescription) {
        const aiResult = await generateResumeContent(resumeData, resumeData.jobDescription);
        optimizedContent = aiResult.optimizedResume;
        matchScore = aiResult.matchScore;
      }

      const resume = await storage.createResume({
        userId,
        title: optimizedContent.title,
        personalInfo: optimizedContent.personalInfo,
        experience: optimizedContent.experience,
        education: optimizedContent.education,
        skills: optimizedContent.skills,
        summary: optimizedContent.personalInfo.summary,
        templateId: optimizedContent.templateId,
        jobDescription: resumeData.jobDescription,
        matchScore,
        isPremium: false, // TODO: Implement premium logic
      });

      res.json(resume);
    } catch (error) {
      console.error("Error creating resume:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid resume data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create resume" });
      }
    }
  });

  app.get("/api/resumes", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const resumes = await storage.getUserResumes(userId);
      res.json(resumes);
    } catch (error) {
      console.error("Error fetching resumes:", error);
      res.status(500).json({ message: "Failed to fetch resumes" });
    }
  });

  app.get("/api/resumes/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const resume = await storage.getResume(req.params.id);
      
      if (!resume || resume.userId !== userId) {
        return res.status(404).json({ message: "Resume not found" });
      }
      
      res.json(resume);
    } catch (error) {
      console.error("Error fetching resume:", error);
      res.status(500).json({ message: "Failed to fetch resume" });
    }
  });

  app.put("/api/resumes/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const resume = await storage.getResume(req.params.id);
      
      if (!resume || resume.userId !== userId) {
        return res.status(404).json({ message: "Resume not found" });
      }

      const updateData = resumeFormSchema.partial().parse(req.body);
      const updatedResume = await storage.updateResume(req.params.id, {
        ...updateData,
        personalInfo: updateData.personalInfo,
        experience: updateData.experience,
        education: updateData.education,
        skills: updateData.skills,
        summary: updateData.personalInfo?.summary,
      });

      res.json(updatedResume);
    } catch (error) {
      console.error("Error updating resume:", error);
      res.status(500).json({ message: "Failed to update resume" });
    }
  });

  app.delete("/api/resumes/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const resume = await storage.getResume(req.params.id);
      
      if (!resume || resume.userId !== userId) {
        return res.status(404).json({ message: "Resume not found" });
      }

      await storage.deleteResume(req.params.id);
      res.json({ message: "Resume deleted successfully" });
    } catch (error) {
      console.error("Error deleting resume:", error);
      res.status(500).json({ message: "Failed to delete resume" });
    }
  });

  // Cover letter routes
  app.post("/api/resumes/:id/cover-letter", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const resume = await storage.getResume(req.params.id);
      
      if (!resume || resume.userId !== userId) {
        return res.status(404).json({ message: "Resume not found" });
      }

      const { tone = "professional", jobDescription } = req.body;
      
      const coverLetterContent = await generateCoverLetter(
        resume,
        jobDescription || resume.jobDescription || "",
        tone
      );

      const coverLetter = await storage.createCoverLetter({
        resumeId: req.params.id,
        content: coverLetterContent,
        tone,
        jobDescription: jobDescription || resume.jobDescription,
      });

      res.json(coverLetter);
    } catch (error) {
      console.error("Error generating cover letter:", error);
      res.status(500).json({ message: "Failed to generate cover letter" });
    }
  });

  app.get("/api/resumes/:id/cover-letter", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const resume = await storage.getResume(req.params.id);
      
      if (!resume || resume.userId !== userId) {
        return res.status(404).json({ message: "Resume not found" });
      }

      const coverLetter = await storage.getCoverLetter(req.params.id);
      res.json(coverLetter);
    } catch (error) {
      console.error("Error fetching cover letter:", error);
      res.status(500).json({ message: "Failed to fetch cover letter" });
    }
  });

  // PDF export route
  app.get("/api/resumes/:id/pdf", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const resume = await storage.getResume(req.params.id);
      
      if (!resume || resume.userId !== userId) {
        return res.status(404).json({ message: "Resume not found" });
      }

      const pdfBuffer = await generateResumePDF(resume);
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${resume.title}.pdf"`);
      res.send(pdfBuffer);
    } catch (error) {
      console.error("Error generating PDF:", error);
      res.status(500).json({ message: "Failed to generate PDF" });
    }
  });

  // AI optimization route
  app.post("/api/resumes/:id/optimize", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const resume = await storage.getResume(req.params.id);
      
      if (!resume || resume.userId !== userId) {
        return res.status(404).json({ message: "Resume not found" });
      }

      const { jobDescription } = req.body;
      if (!jobDescription) {
        return res.status(400).json({ message: "Job description is required" });
      }

      const resumeForm: ResumeForm = {
        title: resume.title,
        personalInfo: resume.personalInfo as any,
        experience: resume.experience as any,
        education: resume.education as any,
        skills: resume.skills,
        templateId: resume.templateId,
        jobDescription,
      };

      const aiResult = await generateResumeContent(resumeForm, jobDescription);
      
      const updatedResume = await storage.updateResume(req.params.id, {
        personalInfo: aiResult.optimizedResume.personalInfo,
        experience: aiResult.optimizedResume.experience,
        education: aiResult.optimizedResume.education,
        skills: aiResult.optimizedResume.skills,
        summary: aiResult.optimizedResume.personalInfo.summary,
        jobDescription,
        matchScore: aiResult.matchScore,
      });

      res.json({
        resume: updatedResume,
        matchScore: aiResult.matchScore,
        optimizations: aiResult.optimizations,
      });
    } catch (error) {
      console.error("Error optimizing resume:", error);
      res.status(500).json({ message: "Failed to optimize resume" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
