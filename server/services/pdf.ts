import type { Resume } from "@shared/schema";

export async function generateResumePDF(resume: Resume): Promise<Buffer> {
  try {
    // Create HTML content for the resume
    const personalInfo = resume.personalInfo as any;
    const experience = resume.experience as any[];
    const education = resume.education as any[];
    
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 800px;
                margin: 0 auto;
                padding: 40px 20px;
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
                border-bottom: 2px solid #2563EB;
                padding-bottom: 20px;
            }
            .name {
                font-size: 32px;
                font-weight: bold;
                color: #1E293B;
                margin-bottom: 5px;
            }
            .title {
                font-size: 18px;
                color: #2563EB;
                margin-bottom: 10px;
            }
            .contact {
                font-size: 14px;
                color: #64748B;
            }
            .section {
                margin-bottom: 25px;
            }
            .section-title {
                font-size: 20px;
                font-weight: bold;
                color: #1E293B;
                border-bottom: 2px solid #2563EB;
                padding-bottom: 5px;
                margin-bottom: 15px;
            }
            .summary {
                font-size: 14px;
                line-height: 1.6;
                color: #374151;
            }
            .experience-item, .education-item {
                margin-bottom: 20px;
            }
            .item-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 5px;
            }
            .position, .degree {
                font-weight: bold;
                color: #1E293B;
                font-size: 16px;
            }
            .company, .school {
                color: #2563EB;
                font-weight: 500;
            }
            .dates {
                color: #64748B;
                font-size: 14px;
            }
            .description {
                color: #374151;
                font-size: 14px;
                margin-top: 8px;
                line-height: 1.5;
            }
            .skills {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
            }
            .skill-tag {
                background: #EFF6FF;
                color: #2563EB;
                padding: 4px 12px;
                border-radius: 16px;
                font-size: 14px;
                border: 1px solid #DBEAFE;
            }
            ${!resume.isPremium ? `
            .watermark {
                position: fixed;
                bottom: 20px;
                right: 20px;
                color: #E5E7EB;
                font-size: 12px;
                transform: rotate(-45deg);
                opacity: 0.7;
            }
            ` : ''}
        </style>
    </head>
    <body>
        <div class="header">
            <div class="name">${personalInfo.firstName} ${personalInfo.lastName}</div>
            <div class="title">${personalInfo.title}</div>
            <div class="contact">
                ${personalInfo.email} • ${personalInfo.phone} • ${personalInfo.location}
            </div>
        </div>

        ${resume.summary ? `
        <div class="section">
            <div class="section-title">Professional Summary</div>
            <div class="summary">${resume.summary}</div>
        </div>
        ` : ''}

        <div class="section">
            <div class="section-title">Experience</div>
            ${experience.map(exp => `
                <div class="experience-item">
                    <div class="item-header">
                        <div>
                            <div class="position">${exp.position}</div>
                            <div class="company">${exp.company}</div>
                        </div>
                        <div class="dates">${exp.startDate} - ${exp.current ? 'Present' : (exp.endDate || 'Present')}</div>
                    </div>
                    <div class="description">${exp.description}</div>
                </div>
            `).join('')}
        </div>

        <div class="section">
            <div class="section-title">Education</div>
            ${education.map(edu => `
                <div class="education-item">
                    <div class="item-header">
                        <div>
                            <div class="degree">${edu.degree}</div>
                            <div class="school">${edu.school}</div>
                        </div>
                        <div class="dates">${edu.graduationDate}</div>
                    </div>
                    ${edu.gpa ? `<div class="description">GPA: ${edu.gpa}</div>` : ''}
                </div>
            `).join('')}
        </div>

        <div class="section">
            <div class="section-title">Skills</div>
            <div class="skills">
                ${resume.skills.map(skill => `
                    <span class="skill-tag">${skill}</span>
                `).join('')}
            </div>
        </div>

        ${!resume.isPremium ? '<div class="watermark">SmartResume - Upgrade for clean exports</div>' : ''}
    </body>
    </html>
    `;

    // For production, you would use a proper HTML to PDF library like Puppeteer
    // For now, we'll return a simple PDF-like response
    // In a real implementation, you'd use something like:
    // const puppeteer = require('puppeteer');
    // const browser = await puppeteer.launch();
    // const page = await browser.newPage();
    // await page.setContent(htmlContent);
    // const pdf = await page.pdf({ format: 'A4' });
    // await browser.close();
    // return pdf;

    // For this demo, return HTML as buffer (in production, implement proper PDF generation)
    return Buffer.from(htmlContent, 'utf-8');
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw new Error("Failed to generate PDF");
  }
}
