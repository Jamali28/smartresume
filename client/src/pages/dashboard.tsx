import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { 
  FileText, 
  Plus, 
  Upload, 
  Edit, 
  Download, 
  Trash2, 
  NotebookPen, 
  Handshake,
  LogOut
} from "lucide-react";
import type { Resume } from "@shared/schema";

export default function Dashboard() {
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

  const { data: resumes, isLoading } = useQuery({
    queryKey: ["/api/resumes"],
    retry: false,
  });

  const deleteResumeMutation = useMutation({
    mutationFn: async (resumeId: string) => {
      await apiRequest("DELETE", `/api/resumes/${resumeId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/resumes"] });
      toast({
        title: "Success",
        description: "Resume deleted successfully",
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
        description: "Failed to delete resume",
        variant: "destructive",
      });
    },
  });

  const downloadResume = async (resumeId: string, title: string) => {
    try {
      const response = await fetch(`/api/resumes/${resumeId}/pdf`, {
        credentials: "include",
      });
      
      if (!response.ok) throw new Error("Failed to download PDF");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${title}.pdf`;
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

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Loading...</h1>
          <p className="text-slate-600">Please wait while we load your dashboard</p>
        </div>
      </div>
    );
  }

  const resumeList = resumes as Resume[] || [];
  const totalResumes = resumeList.length;
  const totalApplications = resumeList.reduce((sum, resume) => sum + (resume.matchScore ? 1 : 0), 0);
  const averageMatchScore = resumeList.length > 0 
    ? Math.round(resumeList.reduce((sum, resume) => sum + (resume.matchScore || 0), 0) / resumeList.length)
    : 0;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">SmartResume</span>
            </div>
            <div className="flex items-center space-x-3">
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
              <span className="text-slate-700 text-sm">
                {user.firstName} {user.lastName}
              </span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Welcome back, {user.firstName}!
          </h1>
          <p className="text-slate-600">
            Ready to create your next winning resume?
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="border-blue-200 bg-blue-50/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-blue-600">{totalResumes}</p>
                  <p className="text-slate-600">Resumes Created</p>
                </div>
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-emerald-200 bg-emerald-50/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-emerald-600">{totalApplications}</p>
                  <p className="text-slate-600">Applications Sent</p>
                </div>
                <NotebookPen className="w-8 h-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-purple-200 bg-purple-50/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-purple-600">{averageMatchScore}%</p>
                  <p className="text-slate-600">Avg Match Score</p>
                </div>
                <Handshake className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/resume/new">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <CardContent className="p-6 flex items-center space-x-4">
                  <Plus className="w-8 h-8" />
                  <div>
                    <p className="font-semibold">Create New Resume</p>
                    <p className="text-blue-100 text-sm">Start with AI-powered generation</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
            
            <Card className="cursor-pointer hover:shadow-lg transition-shadow border-slate-300">
              <CardContent className="p-6 flex items-center space-x-4">
                <Upload className="w-8 h-8 text-slate-600" />
                <div>
                  <p className="font-semibold text-slate-900">Upload Existing Resume</p>
                  <p className="text-slate-500 text-sm">Import and enhance with AI</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Resumes */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Recent Resumes</h3>
            {resumeList.length > 3 && (
              <Button variant="ghost">View All</Button>
            )}
          </div>
          
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        <Skeleton className="w-12 h-12 rounded-lg" />
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-4 w-1/3" />
                          <Skeleton className="h-3 w-1/4" />
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Skeleton className="w-8 h-8" />
                        <Skeleton className="w-8 h-8" />
                        <Skeleton className="w-8 h-8" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : resumeList.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">No resumes yet</h3>
                <p className="text-slate-600 mb-4">
                  Create your first resume to get started with SmartResume
                </p>
                <Link href="/resume/new">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Resume
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {resumeList.slice(0, 5).map((resume) => (
                <Card key={resume.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <p className="font-semibold text-slate-900">{resume.title}</p>
                            {resume.matchScore && resume.matchScore > 80 && (
                              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                                {resume.matchScore}% match
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-slate-600">
                            Updated {new Date(resume.updatedAt!).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Link href={`/resume/${resume.id}/edit`}>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => downloadResume(resume.id, resume.title)}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => deleteResumeMutation.mutate(resume.id)}
                          disabled={deleteResumeMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
