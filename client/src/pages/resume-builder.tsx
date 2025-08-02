import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import ResumeForm from "@/components/resume-form";
import TemplateSelector from "@/components/template-selector";
import { resumeFormSchema, type ResumeForm as ResumeFormType } from "@shared/schema";
import { 
  ArrowLeft, 
  ArrowRight, 
  Save, 
  Sparkles, 
  Eye,
  FileText,
  LogOut
} from "lucide-react";

const STEPS = [
  { id: 1, title: "Personal Info", description: "Basic information and summary" },
  { id: 2, title: "Experience", description: "Work history and achievements" },
  { id: 3, title: "Education & Skills", description: "Education background and skills" },
  { id: 4, title: "Template & AI", description: "Choose template and optimize" },
];

export default function ResumeBuilder() {
  const [, setLocation] = useLocation();
  const { id } = useParams();
  const isEditing = !!id;
  const [currentStep, setCurrentStep] = useState(1);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const { toast } = useToast();
  const { user, isLoading: authLoading } = useAuth();
  const queryClient = useQueryClient();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [user, authLoading, toast]);

  const { data: resume, isLoading } = useQuery({
    queryKey: ["/api/resumes", id],
    enabled: isEditing,
  });

  const form = useForm<ResumeFormType>({
    resolver: zodResolver(resumeFormSchema),
    defaultValues: {
      title: "",
      personalInfo: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        location: "",
        title: "",
        summary: "",
      },
      experience: [{
        position: "",
        company: "",
        startDate: "",
        endDate: "",
        current: false,
        description: "",
      }],
      education: [{
        degree: "",
        school: "",
        graduationDate: "",
        gpa: "",
      }],
      skills: [""],
      templateId: "modern",
      jobDescription: "",
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (resume && isEditing) {
      const personalInfo = resume.personalInfo as any;
      const experience = resume.experience as any[];
      const education = resume.education as any[];

      form.reset({
        title: resume.title,
        personalInfo: {
          firstName: personalInfo.firstName || "",
          lastName: personalInfo.lastName || "",
          email: personalInfo.email || "",
          phone: personalInfo.phone || "",
          location: personalInfo.location || "",
          title: personalInfo.title || "",
          summary: personalInfo.summary || "",
        },
        experience: experience.length > 0 ? experience : [{
          position: "",
          company: "",
          startDate: "",
          endDate: "",
          current: false,
          description: "",
        }],
        education: education.length > 0 ? education : [{
          degree: "",
          school: "",
          graduationDate: "",
          gpa: "",
        }],
        skills: resume.skills.length > 0 ? resume.skills : [""],
        templateId: resume.templateId,
        jobDescription: resume.jobDescription || "",
      });
    }
  }, [resume, isEditing, form]);

  const createResumeMutation = useMutation({
    mutationFn: async (data: ResumeFormType) => {
      const response = await apiRequest("POST", "/api/resumes", data);
      return response.json();
    },
    onSuccess: (newResume) => {
      queryClient.invalidateQueries({ queryKey: ["/api/resumes"] });
      toast({
        title: "Success",
        description: "Resume created successfully!",
      });
      setLocation(`/resume/${newResume.id}/preview`);
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to create resume. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateResumeMutation = useMutation({
    mutationFn: async (data: ResumeFormType) => {
      const response = await apiRequest("PUT", `/api/resumes/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/resumes", id] });
      queryClient.invalidateQueries({ queryKey: ["/api/resumes"] });
      toast({
        title: "Success",
        description: "Resume updated successfully!",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update resume. Please try again.",
        variant: "destructive",
      });
    },
  });

  const optimizeResumeMutation = useMutation({
    mutationFn: async (jobDescription: string) => {
      const response = await apiRequest("POST", `/api/resumes/${id}/optimize`, {
        jobDescription,
      });
      return response.json();
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["/api/resumes", id] });
      toast({
        title: "Resume Optimized!",
        description: `Match score: ${result.matchScore}%. Your resume has been optimized for this job.`,
      });
      setIsOptimizing(false);
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to optimize resume. Please try again.",
        variant: "destructive",
      });
      setIsOptimizing(false);
    },
  });

  const handleOptimize = async () => {
    const jobDescription = form.getValues("jobDescription");
    if (!jobDescription?.trim()) {
      toast({
        title: "Job Description Required",
        description: "Please enter a job description to optimize your resume.",
        variant: "destructive",
      });
      return;
    }

    if (!isEditing) {
      toast({
        title: "Save Resume First",
        description: "Please save your resume before optimizing it.",
        variant: "destructive",
      });
      return;
    }

    setIsOptimizing(true);
    optimizeResumeMutation.mutate(jobDescription);
  };

  const onSubmit = (data: ResumeFormType) => {
    if (isEditing) {
      updateResumeMutation.mutate(data);
    } else {
      createResumeMutation.mutate(data);
    }
  };

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  if (authLoading || !user || (isEditing && isLoading)) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Loading...</h1>
          <p className="text-slate-600">Please wait while we load your resume builder</p>
        </div>
      </div>
    );
  }

  const progress = (currentStep / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => setLocation("/")} className="p-2">
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">Resume Builder</span>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="secondary">
                Step {currentStep} of {STEPS.length}
              </Badge>
              <div className="w-8 h-8 bg-slate-200 rounded-full overflow-hidden">
                {user.profileImageUrl ? (
                  <img 
                    src={user.profileImageUrl} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-300 flex items-center justify-center">
                    <span className="text-xs font-medium text-slate-600">
                      {user.firstName?.[0]}{user.lastName?.[0]}
                    </span>
                  </div>
                )}
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-slate-100 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Step Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            {STEPS[currentStep - 1].title}
          </h1>
          <p className="text-slate-600">
            {STEPS[currentStep - 1].description}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  {currentStep === 4 ? "Template & Optimization" : `Step ${currentStep}`}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {currentStep === 4 ? (
                  <div className="space-y-6">
                    <TemplateSelector
                      value={form.watch("templateId")}
                      onChange={(templateId) => form.setValue("templateId", templateId)}
                    />
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-4">AI Optimization</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Job Description (Optional)
                          </label>
                          <textarea
                            {...form.register("jobDescription")}
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            rows={6}
                            placeholder="Paste the job description here to optimize your resume for this specific role..."
                          />
                        </div>
                        
                        {isEditing && (
                          <Button
                            type="button"
                            onClick={handleOptimize}
                            disabled={isOptimizing || optimizeResumeMutation.isPending}
                            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                          >
                            {isOptimizing || optimizeResumeMutation.isPending ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                Optimizing Resume...
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-4 h-4 mr-2" />
                                Optimize with AI
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <ResumeForm
                    form={form}
                    currentStep={currentStep}
                  />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Preview Section */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="w-5 h-5 mr-2" />
                  Live Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm transform scale-75 origin-top-left w-[133%] h-96 overflow-hidden">
                  <div className="text-center mb-4">
                    <h2 className="text-lg font-bold text-slate-900">
                      {form.watch("personalInfo.firstName")} {form.watch("personalInfo.lastName")}
                    </h2>
                    <p className="text-blue-600 font-medium">
                      {form.watch("personalInfo.title") || "Professional Title"}
                    </p>
                    <div className="text-xs text-slate-600 mt-1">
                      {form.watch("personalInfo.email")} • {form.watch("personalInfo.phone")}
                    </div>
                  </div>
                  
                  {form.watch("personalInfo.summary") && (
                    <div className="mb-3">
                      <h3 className="text-sm font-semibold text-slate-900 mb-1 border-b border-blue-600">
                        Professional Summary
                      </h3>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {form.watch("personalInfo.summary")}
                      </p>
                    </div>
                  )}
                  
                  <div className="mb-3">
                    <h3 className="text-sm font-semibold text-slate-900 mb-1 border-b border-blue-600">
                      Experience
                    </h3>
                    {form.watch("experience").map((exp, index) => 
                      exp.position && exp.company ? (
                        <div key={index} className="text-xs mb-2">
                          <div className="font-medium">{exp.position}</div>
                          <div className="text-blue-600">{exp.company}</div>
                        </div>
                      ) : null
                    )}
                  </div>
                  
                  <div className="mb-3">
                    <h3 className="text-sm font-semibold text-slate-900 mb-1 border-b border-blue-600">
                      Skills
                    </h3>
                    <div className="flex flex-wrap gap-1">
                      {form.watch("skills").filter(skill => skill.trim()).map((skill, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="flex space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.handleSubmit(onSubmit)()}
              disabled={createResumeMutation.isPending || updateResumeMutation.isPending}
            >
              <Save className="w-4 h-4 mr-2" />
              {createResumeMutation.isPending || updateResumeMutation.isPending
                ? "Saving..."
                : "Save Draft"
              }
            </Button>

            {currentStep < STEPS.length ? (
              <Button type="button" onClick={handleNext}>
                Next Step
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={() => form.handleSubmit(onSubmit)()}
                disabled={createResumeMutation.isPending || updateResumeMutation.isPending}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
              >
                {createResumeMutation.isPending || updateResumeMutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Creating...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 mr-2" />
                    {isEditing ? "Update Resume" : "Create Resume"}
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
