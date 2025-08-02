import type { Resume } from "@shared/schema";

interface ResumeTemplatesProps {
  resume: Resume;
  templateId: string;
}

export default function ResumeTemplates({ resume, templateId }: ResumeTemplatesProps) {
  const personalInfo = resume.personalInfo as any;
  const experience = resume.experience as any[];
  const education = resume.education as any[];

  if (templateId === "modern") {
    return (
      <div className="bg-white p-8 min-h-[800px] shadow-lg">
        {/* Header */}
        <div className="text-center mb-8 pb-6 border-b-2 border-blue-600">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            {personalInfo.firstName} {personalInfo.lastName}
          </h1>
          <h2 className="text-xl text-blue-600 font-medium mb-3">{personalInfo.title}</h2>
          <div className="text-slate-600 space-x-2">
            <span>{personalInfo.email}</span>
            <span>•</span>
            <span>{personalInfo.phone}</span>
            <span>•</span>
            <span>{personalInfo.location}</span>
          </div>
        </div>

        {/* Professional Summary */}
        {resume.summary && (
          <div className="mb-8">
            <h3 className="text-lg font-bold text-slate-900 mb-3 border-b-2 border-blue-600 pb-1">
              Professional Summary
            </h3>
            <p className="text-slate-700 leading-relaxed">{resume.summary}</p>
          </div>
        )}

        {/* Experience */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-slate-900 mb-4 border-b-2 border-blue-600 pb-1">
            Professional Experience
          </h3>
          <div className="space-y-6">
            {experience.map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-bold text-slate-900">{exp.position}</h4>
                    <p className="text-blue-600 font-medium">{exp.company}</p>
                  </div>
                  <span className="text-slate-600 text-sm">
                    {exp.startDate} - {exp.current ? 'Present' : (exp.endDate || 'Present')}
                  </span>
                </div>
                <div className="text-slate-700 leading-relaxed whitespace-pre-line">
                  {exp.description}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Education */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-slate-900 mb-4 border-b-2 border-blue-600 pb-1">
            Education
          </h3>
          <div className="space-y-4">
            {education.map((edu, index) => (
              <div key={index} className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-slate-900">{edu.degree}</h4>
                  <p className="text-blue-600 font-medium">{edu.school}</p>
                  {edu.gpa && <p className="text-slate-600 text-sm">GPA: {edu.gpa}</p>}
                </div>
                <span className="text-slate-600 text-sm">{edu.graduationDate}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-4 border-b-2 border-blue-600 pb-1">
            Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {resume.skills.map((skill, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (templateId === "minimal") {
    return (
      <div className="bg-white p-8 min-h-[800px] shadow-lg">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-1">
            {personalInfo.firstName} {personalInfo.lastName}
          </h1>
          <h2 className="text-lg text-slate-600 mb-3">{personalInfo.title}</h2>
          <div className="text-slate-600 text-sm">
            {personalInfo.email} • {personalInfo.phone} • {personalInfo.location}
          </div>
        </div>

        {/* Professional Summary */}
        {resume.summary && (
          <div className="mb-8">
            <h3 className="text-lg font-bold text-slate-900 mb-3 uppercase tracking-wide">
              Summary
            </h3>
            <p className="text-slate-700 leading-relaxed">{resume.summary}</p>
          </div>
        )}

        {/* Experience */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-slate-900 mb-4 uppercase tracking-wide">
            Experience
          </h3>
          <div className="space-y-6">
            {experience.map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-bold text-slate-900">{exp.position}</h4>
                    <p className="text-slate-700">{exp.company}</p>
                  </div>
                  <span className="text-slate-600 text-sm">
                    {exp.startDate} - {exp.current ? 'Present' : (exp.endDate || 'Present')}
                  </span>
                </div>
                <div className="text-slate-700 leading-relaxed whitespace-pre-line">
                  {exp.description}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Education */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-slate-900 mb-4 uppercase tracking-wide">
            Education
          </h3>
          <div className="space-y-4">
            {education.map((edu, index) => (
              <div key={index} className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-slate-900">{edu.degree}</h4>
                  <p className="text-slate-700">{edu.school}</p>
                  {edu.gpa && <p className="text-slate-600 text-sm">GPA: {edu.gpa}</p>}
                </div>
                <span className="text-slate-600 text-sm">{edu.graduationDate}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-4 uppercase tracking-wide">
            Skills
          </h3>
          <div className="text-slate-700">
            {resume.skills.join(' • ')}
          </div>
        </div>
      </div>
    );
  }

  if (templateId === "executive") {
    return (
      <div className="bg-white p-8 min-h-[800px] shadow-lg relative">
        {/* Left border accent */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-600"></div>
        
        <div className="pl-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              {personalInfo.firstName} {personalInfo.lastName}
            </h1>
            <h2 className="text-xl text-purple-600 font-medium mb-3">{personalInfo.title}</h2>
            <div className="text-slate-600">
              {personalInfo.email} • {personalInfo.phone} • {personalInfo.location}
            </div>
          </div>

          {/* Professional Summary */}
          {resume.summary && (
            <div className="mb-8">
              <h3 className="text-lg font-bold text-purple-600 mb-3 uppercase tracking-wide">
                Executive Summary
              </h3>
              <p className="text-slate-700 leading-relaxed">{resume.summary}</p>
            </div>
          )}

          {/* Experience */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-purple-600 mb-4 uppercase tracking-wide">
              Professional Experience
            </h3>
            <div className="space-y-6">
              {experience.map((exp, index) => (
                <div key={index}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-slate-900 text-lg">{exp.position}</h4>
                      <p className="text-purple-600 font-medium">{exp.company}</p>
                    </div>
                    <span className="text-slate-600">
                      {exp.startDate} - {exp.current ? 'Present' : (exp.endDate || 'Present')}
                    </span>
                  </div>
                  <div className="text-slate-700 leading-relaxed whitespace-pre-line">
                    {exp.description}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-purple-600 mb-4 uppercase tracking-wide">
              Education
            </h3>
            <div className="space-y-4">
              {education.map((edu, index) => (
                <div key={index} className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-900">{edu.degree}</h4>
                    <p className="text-purple-600 font-medium">{edu.school}</p>
                    {edu.gpa && <p className="text-slate-600 text-sm">GPA: {edu.gpa}</p>}
                  </div>
                  <span className="text-slate-600">{edu.graduationDate}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div>
            <h3 className="text-lg font-bold text-purple-600 mb-4 uppercase tracking-wide">
              Core Competencies
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {resume.skills.map((skill, index) => (
                <div key={index} className="text-slate-700 border-l-2 border-purple-200 pl-3">
                  {skill}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default fallback to modern template
  return (
    <div className="bg-white p-8 min-h-[800px] shadow-lg">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Template Not Found</h1>
        <p className="text-slate-600">The selected template is not available.</p>
      </div>
    </div>
  );
}
