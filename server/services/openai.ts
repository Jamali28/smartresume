import OpenAI from "openai";
import type { ResumeForm, Resume } from "@shared/schema";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.API_KEY || "sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
});

export async function generateResumeContent(
  resumeData: ResumeForm, 
  jobDescription: string
): Promise<{
  optimizedResume: ResumeForm;
  matchScore: number;
  optimizations: string[];
}> {
  try {
    const prompt = `You are an expert resume writer and career coach. Analyze the provided job description and optimize the resume to better match the requirements while maintaining truthfulness.

Job Description:
${jobDescription}

Current Resume Data:
${JSON.stringify(resumeData, null, 2)}

Please optimize the resume by:
1. Rewriting the professional summary to highlight relevant skills
2. Enhancing experience descriptions to match job requirements using relevant keywords
3. Reordering and emphasizing skills that match the job posting
4. Calculating a match score (1-100) based on how well the resume aligns with the job
5. Providing a list of specific optimizations made

Respond with JSON in this exact format:
{
  "optimizedResume": {
    "title": "string",
    "personalInfo": {
      "firstName": "string",
      "lastName": "string",
      "email": "string",
      "phone": "string",
      "location": "string",
      "title": "string",
      "summary": "optimized professional summary"
    },
    "experience": [
      {
        "position": "string",
        "company": "string",
        "startDate": "string",
        "endDate": "string",
        "current": boolean,
        "description": "enhanced description with relevant keywords"
      }
    ],
    "education": [same format as input],
    "skills": ["reordered and enhanced skills array"],
    "templateId": "string"
  },
  "matchScore": number,
  "optimizations": ["list of specific changes made"]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert resume writer and ATS optimization specialist. Always respond with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const result = JSON.parse(response.choices[0].message.content!);
    
    return {
      optimizedResume: result.optimizedResume,
      matchScore: Math.max(1, Math.min(100, result.matchScore)),
      optimizations: result.optimizations || []
    };
  } catch (error) {
    console.error("Error generating resume content:", error);
    throw new Error("Failed to optimize resume with AI");
  }
}

export async function generateCoverLetter(
  resume: Resume,
  jobDescription: string,
  tone: string = "professional"
): Promise<string> {
  try {
    const prompt = `You are an expert cover letter writer. Create a compelling cover letter based on the resume and job description provided.

Tone: ${tone}
Job Description:
${jobDescription}

Resume Information:
- Name: ${(resume.personalInfo as any).firstName} ${(resume.personalInfo as any).lastName}
- Title: ${(resume.personalInfo as any).title}
- Summary: ${resume.summary}
- Experience: ${JSON.stringify(resume.experience)}
- Skills: ${resume.skills.join(', ')}

Guidelines:
1. Use the specified tone (${tone})
2. Highlight relevant experience and skills from the resume
3. Address specific requirements mentioned in the job description
4. Keep it concise and compelling (3-4 paragraphs)
5. Include a strong opening and closing
6. Make it personal and specific to this role

Write a complete cover letter that would make the candidate stand out. Do not include placeholders like [Company Name] - extract the actual company name from the job description if available.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert cover letter writer. Write compelling, personalized cover letters that help candidates stand out. Use a ${tone} tone.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8,
    });

    return response.choices[0].message.content!;
  } catch (error) {
    console.error("Error generating cover letter:", error);
    throw new Error("Failed to generate cover letter with AI");
  }
}

export async function analyzeToneOptions(): Promise<string[]> {
  return [
    "professional",
    "friendly",
    "enthusiastic",
    "formal",
    "confident",
    "conversational"
  ];
}
