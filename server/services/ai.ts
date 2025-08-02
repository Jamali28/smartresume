import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export interface JobAnalysisResult {
  matchScore: number;
  enhancedSummary: string;
  optimizedExperience: Array<{
    position: string;
    company: string;
    startDate: string;
    endDate?: string;
    current: boolean;
    description: string;
  }>;
  suggestedSkills: string[];
  feedback: string;
}

export interface CoverLetterRequest {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    location: string;
    title: string;
  };
  experience: Array<{
    position: string;
    company: string;
    description: string;
  }>;
  jobDescription: string;
  tone: string;
}

export async function analyzeJobAndOptimizeResume(
  resumeData: any,
  jobDescription: string
): Promise<JobAnalysisResult> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `You are an expert resume optimizer and ATS specialist. Your task is to analyze a job description and optimize a resume to maximize the match score and improve ATS compatibility.

Job Description:
${jobDescription}

Current Resume Data:
Name: ${resumeData.personalInfo.firstName} ${resumeData.personalInfo.lastName}
Title: ${resumeData.personalInfo.title}
Summary: ${resumeData.summary || "No summary provided"}

Experience:
${resumeData.experience.map((exp: any) => `
- ${exp.position} at ${exp.company}
  ${exp.description}
`).join('')}

Current Skills: ${resumeData.skills.join(', ')}

Please analyze this job description and optimize the resume for maximum ATS compatibility and relevance. Focus on:
1. Calculating an accurate match score
2. Enhancing the professional summary with relevant keywords
3. Optimizing experience descriptions with action verbs and quantifiable achievements
4. Suggesting additional relevant skills from the job description
5. Ensuring ATS-friendly formatting and keyword density

Provide your response in JSON format with the following structure:
{
  "matchScore": number (0-100),
  "enhancedSummary": "optimized professional summary",
  "optimizedExperience": array of experience objects with optimized descriptions,
  "suggestedSkills": array of relevant skills to add,
  "feedback": "brief explanation of changes made"
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in response");
    }
    
    const parsedResult = JSON.parse(jsonMatch[0]);
    
    return {
      matchScore: Math.max(0, Math.min(100, parsedResult.matchScore || 0)),
      enhancedSummary: parsedResult.enhancedSummary || resumeData.summary || '',
      optimizedExperience: parsedResult.optimizedExperience || resumeData.experience,
      suggestedSkills: parsedResult.suggestedSkills || [],
      feedback: parsedResult.feedback || 'Analysis completed successfully.'
    };
  } catch (error) {
    console.error("Error analyzing job and optimizing resume:", error);
    throw new Error("Failed to analyze job description and optimize resume");
  }
}

export async function generateCoverLetter(request: CoverLetterRequest): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `You are an expert cover letter writer. Create compelling, personalized cover letters that highlight relevant experience and demonstrate genuine interest in the role. Write in a ${request.tone} tone.

Create a cover letter for the following:

Personal Information:
- Name: ${request.personalInfo.firstName} ${request.personalInfo.lastName}
- Title: ${request.personalInfo.title}
- Email: ${request.personalInfo.email}
- Phone: ${request.personalInfo.phone}
- Location: ${request.personalInfo.location}

Relevant Experience:
${request.experience.map(exp => `- ${exp.position} at ${exp.company}: ${exp.description}`).join('\n')}

Job Description:
${request.jobDescription}

Requirements:
1. Start with a compelling opening that shows genuine interest
2. Highlight 2-3 most relevant experiences that match the job requirements
3. Demonstrate knowledge of the company/role
4. Include a strong closing with call to action
5. Keep it concise (3-4 paragraphs)
6. Use a ${request.tone} tone throughout
7. Avoid generic phrases and clichés

Provide only the cover letter content, no additional formatting or explanations.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating cover letter:", error);
    throw new Error("Failed to generate cover letter");
  }
}

export async function generateResumeInsights(resumeData: any): Promise<{
  strengthsScore: number;
  weaknessesScore: number;
  suggestions: string[];
  overallRating: number;
}> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `You are a resume analysis expert. Analyze the provided resume and provide insights on its strengths, weaknesses, and improvement suggestions.

Analyze this resume:

Personal Info: ${resumeData.personalInfo.firstName} ${resumeData.personalInfo.lastName}
Title: ${resumeData.personalInfo.title}
Summary: ${resumeData.summary || "No summary provided"}

Experience:
${resumeData.experience.map((exp: any) => `${exp.position} at ${exp.company}: ${exp.description}`).join('\n')}

Education:
${resumeData.education.map((edu: any) => `${edu.degree} from ${edu.school}`).join('\n')}

Skills: ${resumeData.skills.join(', ')}

Provide detailed analysis focusing on:
1. Content quality and relevance
2. Achievement quantification
3. Keyword optimization
4. Structure and formatting
5. ATS compatibility

Provide your response in JSON format:
{
  "strengthsScore": number (0-100),
  "weaknessesScore": number (0-100),
  "suggestions": array of specific improvement suggestions,
  "overallRating": number (0-100)
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in response");
    }
    
    const parsedResult = JSON.parse(jsonMatch[0]);
    
    return {
      strengthsScore: Math.max(0, Math.min(100, parsedResult.strengthsScore || 75)),
      weaknessesScore: Math.max(0, Math.min(100, parsedResult.weaknessesScore || 25)),
      suggestions: parsedResult.suggestions || [],
      overallRating: Math.max(0, Math.min(100, parsedResult.overallRating || 75))
    };
  } catch (error) {
    console.error("Error generating resume insights:", error);
    throw new Error("Failed to generate resume insights");
  }
}