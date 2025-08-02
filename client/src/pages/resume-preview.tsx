import { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import ResumeTemplates from "@/components/resume-templates";
import { 
  ArrowLeft, 
  Download, 
  Edit, 
  Mail, 
  FileText,
  LogOut,
  Sparkles
} from "lucide-react";
import type { Resume, CoverLetter } from "@shared/schema";

export default function ResumePreview() {
  const [, setLocation] = useLocation();
  const { id } = useParams();
  const [selectedTone, setSelectedTone] = useState("professional");
  const { toast } = useToast();
  const { user, isLoading: authLoading } = useAuth();

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
    retry: false,
  });

  const { data: coverLetter } = useQuery({
    queryKey: ["/api/resumes", id, "cover-letter"],
    retry: false,
  });

  const generateCoverLetterMutation = useMutation({
    mutationFn: async ({ tone }: { tone: string }) => {
      const response = await apiRequest("POST", `/api/resumes/${id}/cover-letter`, {
        tone,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Cover letter generated successfully!",
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
        description: "Failed to generate cover letter. Please try again.",
        variant: "destructive",
      });
    },
  });

  const downloadResume = async () => {
    try {
      const response = await fetch(`/api/resumes/${id}/pdf`, {
        credentials: "include",
      });
      
      if (!response.ok) throw new Error("Failed to download PDF");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${(resume as Resume)?.title || 'resume'}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download resume",
        variant: "destructive",
      });
    }
  };

  const handleGenerateCoverLetter = () => {
    generateCoverLetterMutation.mutate({ tone: selectedTone });
  };

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  if (authLoading || !user || isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Loading...</h1>
          <p className="text-slate-600">Please wait while we load your resume</p>
        </div>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Resume Not Found</h1>
          <p className="text-slate-600 mb-4">The resume you're looking for doesn't exist.</p>
          <Button onClick={() => setLocation("/")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const resumeData = resume as Resume;
  const coverLetterData = coverLetter as CoverLetter;

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
              <div>
                <span className="text-xl font-bold text-slate-900">Resume Preview</span>
                <p className="text-sm text-slate-600">{resumeData.title}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {resumeData.matchScore && (
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                  {resumeData.matchScore}% match
                </Badge>
              )}
              <div className="w-8 h-8 bg-slate-200 rounded-full overflow-hidden">
                {user?.profileImageUrl ? (
                  <img 
                    src={user.profileImageUrl} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-300 flex items-center justify-center">
                    <span className="text-xs font-medium text-slate-600">
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Actions Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={downloadResume}
                  className="w-full"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => setLocation(`/resume/${id}/edit`)}
                  className="w-full"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Resume
                </Button>
              </CardContent>
            </Card>

            {/* Cover Letter Generator */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="w-5 h-5 mr-2" />
                  Cover Letter
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Tone
                  </label>
                  <Select value={selectedTone} onValueChange={setSelectedTone}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="friendly">Friendly</SelectItem>
                      <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                      <SelectItem value="formal">Formal</SelectItem>
                      <SelectItem value="confident">Confident</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button
                  onClick={handleGenerateCoverLetter}
                  disabled={generateCoverLetterMutation.isPending}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                >
                  {generateCoverLetterMutation.isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Cover Letter
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Resume Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Resume Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Template</span>
                  <Badge variant="outline" className="capitalize">
                    {resumeData.templateId}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Created</span>
                  <span className="text-sm">
                    {new Date(resumeData.createdAt!).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Updated</span>
                  <span className="text-sm">
                    {new Date(resumeData.updatedAt!).toLocaleDateString()}
                  </span>
                </div>
                
                {resumeData.matchScore && (
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">AI Match Score</span>
                    <Badge className="bg-emerald-100 text-emerald-700">
                      {resumeData.matchScore}%
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="resume" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="resume">Resume</TabsTrigger>
                <TabsTrigger value="cover-letter">Cover Letter</TabsTrigger>
              </TabsList>
              
              <TabsContent value="resume" className="mt-6">
                <Card>
                  <CardContent className="p-0">
                    <ResumeTemplates 
                      resume={resumeData}
                      templateId={resumeData.templateId}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="cover-letter" className="mt-6">
                <Card>
                  <CardContent className="p-8">
                    {coverLetterData ? (
                      <div className="prose max-w-none">
                        <div className="whitespace-pre-wrap text-slate-800 leading-relaxed">
                          {coverLetterData.content}
                        </div>
                        <div className="mt-6 pt-6 border-t border-slate-200">
                          <div className="flex items-center justify-between text-sm text-slate-600">
                            <span>Tone: <span className="capitalize font-medium">{coverLetterData.tone}</span></span>
                            <span>Generated: {new Date(coverLetterData.createdAt!).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Mail className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-slate-900 mb-2">No Cover Letter Yet</h3>
                        <p className="text-slate-600 mb-6">
                          Generate a personalized cover letter using AI to complement your resume.
                        </p>
                        <Button
                          onClick={handleGenerateCoverLetter}
                          disabled={generateCoverLetterMutation.isPending}
                          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                        >
                          {generateCoverLetterMutation.isPending ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4 mr-2" />
                              Generate Cover Letter
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
