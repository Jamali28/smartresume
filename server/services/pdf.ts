import puppeteer from 'puppeteer';
import type { Resume, PersonalInfo, Experience, Education } from '@shared/schema';

export async function generateResumePDF(resume: Resume): Promise<Buffer> {
  let browser;
  
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    const personalInfo = resume.personalInfo as PersonalInfo;
    const experience = resume.experience as Experience[];
    const education = resume.education as Education[];
    
    const html = generateResumeHTML(resume, personalInfo, experience, education);
    
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm'
      }
    });
    
    return Buffer.from(pdfBuffer);
  } catch (error) {
    console.error('PDF generation error:', error);
    throw new Error('Failed to generate PDF');
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

function generateResumeHTML(
  resume: Resume, 
  personalInfo: PersonalInfo, 
  experience: Experience[], 
  education: Education[]
): string {
  const templateId = resume.templateId || 'modern';
  
  // Common styles
  const baseStyles = `
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        line-height: 1.6;
        color: #333;
      }
      
      .header {
        text-align: center;
        padding: 20px 0;
        border-bottom: 2px solid #2563eb;
        margin-bottom: 20px;
      }
      
      .name {
        font-size: 28px;
        font-weight: bold;
        color: #1e40af;
        margin-bottom: 5px;
      }
      
      .title {
        font-size: 18px;
        color: #6b7280;
        margin-bottom: 10px;
      }
      
      .contact {
        display: flex;
        justify-content: center;
        gap: 20px;
        flex-wrap: wrap;
        font-size: 14px;
        color: #6b7280;
      }
      
      .section {
        margin-bottom: 25px;
      }
      
      .section-title {
        font-size: 20px;
        font-weight: bold;
        color: #1e40af;
        border-bottom: 1px solid #e5e7eb;
        padding-bottom: 5px;
        margin-bottom: 15px;
      }
      
      .experience-item, .education-item {
        margin-bottom: 20px;
        padding-left: 20px;
        border-left: 3px solid #3b82f6;
      }
      
      .job-title, .degree {
        font-size: 16px;
        font-weight: bold;
        color: #1f2937;
      }
      
      .company, .school {
        font-size: 14px;
        color: #6b7280;
        margin-bottom: 5px;
      }
      
      .date {
        font-size: 12px;
        color: #9ca3af;
        margin-bottom: 10px;
      }
      
      .description {
        font-size: 14px;
        line-height: 1.5;
        color: #4b5563;
      }
      
      .skills {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
      }
      
      .skill {
        background-color: #eff6ff;
        color: #1e40af;
        padding: 5px 12px;
        border-radius: 15px;
        font-size: 12px;
        border: 1px solid #dbeafe;
      }
      
      .summary {
        font-size: 14px;
        line-height: 1.6;
        color: #4b5563;
        text-align: justify;
      }
      
      ${!resume.isPremium ? `
        .watermark {
          position: fixed;
          bottom: 10px;
          right: 10px;
          color: #d1d5db;
          font-size: 10px;
          opacity: 0.7;
        }
      ` : ''}
    </style>
  `;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${resume.title}</title>
      ${baseStyles}
    </head>
    <body>
      <div class="header">
        <div class="name">${personalInfo.firstName} ${personalInfo.lastName}</div>
        <div class="title">${personalInfo.title}</div>
        <div class="contact">
          <span>${personalInfo.email}</span>
          <span>${personalInfo.phone}</span>
          <span>${personalInfo.location}</span>
        </div>
      </div>
      
      ${resume.summary ? `
        <div class="section">
          <div class="section-title">Professional Summary</div>
          <div class="summary">${resume.summary}</div>
        </div>
      ` : ''}
      
      <div class="section">
        <div class="section-title">Professional Experience</div>
        ${experience.map(exp => `
          <div class="experience-item">
            <div class="job-title">${exp.position}</div>
            <div class="company">${exp.company}</div>
            <div class="date">${exp.startDate} - ${exp.current ? 'Present' : exp.endDate || 'Present'}</div>
            <div class="description">${exp.description}</div>
          </div>
        `).join('')}
      </div>
      
      <div class="section">
        <div class="section-title">Education</div>
        ${education.map(edu => `
          <div class="education-item">
            <div class="degree">${edu.degree}</div>
            <div class="school">${edu.school}</div>
            <div class="date">${edu.graduationDate}</div>
            ${edu.gpa ? `<div class="description">GPA: ${edu.gpa}</div>` : ''}
          </div>
        `).join('')}
      </div>
      
      <div class="section">
        <div class="section-title">Skills</div>
        <div class="skills">
          ${resume.skills.map(skill => `<span class="skill">${skill}</span>`).join('')}
        </div>
      </div>
      
      ${!resume.isPremium ? '<div class="watermark">Generated with SmartResume</div>' : ''}
    </body>
    </html>
  `;
}