import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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
    const systemPrompt = `You are an expert resume optimizer and ATS specialist. Your task is to analyze a job description and optimize a resume to maximize the match score and improve ATS compatibility.

Provide your response in JSON format with the following structure:
{
  "matchScore": number (0-100),
  "enhancedSummary": "optimized professional summary",
  "optimizedExperience": array of experience objects with optimized descriptions,
  "suggestedSkills": array of relevant skills to add,
  "feedback": "brief explanation of changes made"
}`;

    const userPrompt = `Job Description:
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
5. Ensuring ATS-friendly formatting and keyword density`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    return {
      matchScore: Math.max(0, Math.min(100, result.matchScore || 0)),
      enhancedSummary: result.enhancedSummary || resumeData.summary || '',
      optimizedExperience: result.optimizedExperience || resumeData.experience,
      suggestedSkills: result.suggestedSkills || [],
      feedback: result.feedback || 'Analysis completed successfully.'
    };
  } catch (error) {
    console.error("Error analyzing job and optimizing resume:", error);
    throw new Error("Failed to analyze job description and optimize resume");
  }
}

export async function generateCoverLetter(request: CoverLetterRequest): Promise<string> {
  try {
    const systemPrompt = `You are an expert cover letter writer. Create compelling, personalized cover letters that highlight relevant experience and demonstrate genuine interest in the role. Write in a ${request.tone} tone.`;

    const userPrompt = `Create a cover letter for the following:

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
7. Avoid generic phrases and clichés`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.8,
    });

    return response.choices[0].message.content || '';
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
    const systemPrompt = `You are a resume analysis expert. Analyze the provided resume and provide insights on its strengths, weaknesses, and improvement suggestions. 

Provide your response in JSON format:
{
  "strengthsScore": number (0-100),
  "weaknessesScore": number (0-100),
  "suggestions": array of specific improvement suggestions,
  "overallRating": number (0-100)
}`;

    const userPrompt = `Analyze this resume:

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
5. ATS compatibility`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    return {
      strengthsScore: Math.max(0, Math.min(100, result.strengthsScore || 75)),
      weaknessesScore: Math.max(0, Math.min(100, result.weaknessesScore || 25)),
      suggestions: result.suggestions || [],
      overallRating: Math.max(0, Math.min(100, result.overallRating || 75))
    };
  } catch (error) {
    console.error("Error generating resume insights:", error);
    throw new Error("Failed to generate resume insights");
  }
}