import { GoogleGenerativeAI } from '@google/generative-ai';
import type { ResumeForm, PersonalInfo, Experience, Education } from '@shared/schema';

// Initialize Google Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

export interface AIOptimizationResult {
  enhancedSummary: string;
  optimizedExperience: Experience[];
  suggestedSkills: string[];
  matchScore: number;
  optimizations: string[];
}

export interface ResumeContentResult {
  optimizedResume: ResumeForm;
  matchScore: number;
  optimizations: string[];
}

export async function analyzeJobAndOptimizeResume(
  resumeData: ResumeForm,
  jobDescription: string
): Promise<AIOptimizationResult> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is required for AI optimization');
  }

  try {
    const prompt = `
You are an expert resume optimizer. Analyze the job description and optimize the resume content accordingly.

Job Description:
${jobDescription}

Current Resume Data:
- Personal Info: ${JSON.stringify(resumeData.personalInfo)}
- Experience: ${JSON.stringify(resumeData.experience)}
- Education: ${JSON.stringify(resumeData.education)}
- Skills: ${JSON.stringify(resumeData.skills)}

Please provide:
1. An enhanced professional summary (2-3 sentences)
2. Optimized experience descriptions that better match the job requirements
3. Suggested additional skills based on the job description
4. A match score (0-100) indicating how well the resume aligns with the job
5. Key optimizations made

Respond in the following JSON format:
{
  "enhancedSummary": "Enhanced professional summary here",
  "optimizedExperience": [array of experience objects with enhanced descriptions],
  "suggestedSkills": ["skill1", "skill2", "skill3"],
  "matchScore": 85,
  "optimizations": ["optimization1", "optimization2", "optimization3"]
}

Ensure the optimized experience array maintains the same structure as the input with position, company, startDate, endDate, current, and description fields.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Try to parse JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid AI response format');
    }
    
    const aiResult = JSON.parse(jsonMatch[0]);
    
    return {
      enhancedSummary: aiResult.enhancedSummary || resumeData.personalInfo.summary || '',
      optimizedExperience: aiResult.optimizedExperience || resumeData.experience,
      suggestedSkills: aiResult.suggestedSkills || [],
      matchScore: aiResult.matchScore || 0,
      optimizations: aiResult.optimizations || []
    };
  } catch (error) {
    console.error('AI optimization error:', error);
    // Return original data if AI fails
    return {
      enhancedSummary: resumeData.personalInfo.summary || '',
      optimizedExperience: resumeData.experience,
      suggestedSkills: [],
      matchScore: 0,
      optimizations: ['AI optimization temporarily unavailable']
    };
  }
}

export async function generateCoverLetter(
  resume: any,
  jobDescription: string,
  tone: string = 'professional'
): Promise<string> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is required for cover letter generation');
  }

  try {
    const personalInfo = resume.personalInfo as PersonalInfo;
    const experience = resume.experience as Experience[];
    
    const prompt = `
Generate a professional cover letter based on the following information:

Personal Information:
- Name: ${personalInfo.firstName} ${personalInfo.lastName}
- Email: ${personalInfo.email}
- Phone: ${personalInfo.phone}
- Location: ${personalInfo.location}
- Professional Title: ${personalInfo.title}

Recent Experience:
${experience.slice(0, 2).map(exp => `- ${exp.position} at ${exp.company}: ${exp.description}`).join('\n')}

Skills: ${resume.skills.join(', ')}

Job Description:
${jobDescription}

Tone: ${tone}

Please write a compelling cover letter that:
1. Addresses the specific job requirements
2. Highlights relevant experience and skills
3. Shows enthusiasm for the role
4. Maintains a ${tone} tone
5. Is approximately 3-4 paragraphs long

Do not include placeholders like [Company Name] - use specific information from the job description when available.
Format as plain text without any markup.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Cover letter generation error:', error);
    return `Dear Hiring Manager,

I am writing to express my interest in the position described in your job posting. With my background as a ${resume.personalInfo.title} and experience in ${resume.skills.slice(0, 3).join(', ')}, I believe I would be a valuable addition to your team.

My professional experience includes ${resume.experience[0]?.position} at ${resume.experience[0]?.company}, where I gained valuable skills that align with your requirements. I am particularly excited about the opportunity to contribute to your organization and further develop my expertise in this field.

Thank you for considering my application. I look forward to the opportunity to discuss how my background and enthusiasm can contribute to your team's success.

Sincerely,
${resume.personalInfo.firstName} ${resume.personalInfo.lastName}`;
  }
}

export async function generateResumeInsights(resume: any): Promise<{
  strengths: string[];
  improvements: string[];
  suggestions: string[];
}> {
  if (!process.env.GEMINI_API_KEY) {
    return {
      strengths: ['Professional experience documented'],
      improvements: ['Consider adding more quantifiable achievements'],
      suggestions: ['Include relevant certifications or training']
    };
  }

  try {
    const prompt = `
Analyze this resume and provide insights:

${JSON.stringify(resume, null, 2)}

Provide analysis in JSON format:
{
  "strengths": ["strength1", "strength2", "strength3"],
  "improvements": ["improvement1", "improvement2", "improvement3"],
  "suggestions": ["suggestion1", "suggestion2", "suggestion3"]
}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid AI response format');
    }
    
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Resume insights error:', error);
    return {
      strengths: ['Professional experience documented'],
      improvements: ['Consider adding more quantifiable achievements'],
      suggestions: ['Include relevant certifications or training']
    };
  }
}