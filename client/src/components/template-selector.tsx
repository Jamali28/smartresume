import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

interface TemplateSelectorProps {
  value: string;
  onChange: (templateId: string) => void;
}

const templates = [
  {
    id: "modern",
    name: "Modern Professional",
    description: "Clean and contemporary design perfect for tech and creative roles",
    badge: "Most Popular",
    badgeVariant: "default" as const,
  },
  {
    id: "minimal",
    name: "Minimal Clean", 
    description: "Simple and elegant design that focuses on your content",
    badge: "ATS Optimized",
    badgeVariant: "secondary" as const,
  },
  {
    id: "executive",
    name: "Executive",
    description: "Professional design perfect for senior-level positions",
    badge: "Premium",
    badgeVariant: "outline" as const,
  }
];

export default function TemplateSelector({ value, onChange }: TemplateSelectorProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Choose Template</h3>
      <div className="grid md:grid-cols-3 gap-4">
        {templates.map((template) => (
          <Card 
            key={template.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              value === template.id 
                ? 'ring-2 ring-blue-500 border-blue-500' 
                : 'border-slate-200 hover:border-blue-300'
            }`}
            onClick={() => onChange(template.id)}
          >
            <CardContent className="p-4">
              {/* Template Preview */}
              <div className="aspect-[3/4] bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg mb-4 p-3 relative overflow-hidden">
                {template.id === "modern" && (
                  <div className="bg-white h-full rounded-md shadow-sm p-3 text-xs">
                    <div className="text-center mb-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-full mx-auto mb-2"></div>
                      <div className="h-2 bg-slate-800 rounded mb-1"></div>
                      <div className="h-1 bg-blue-600 rounded w-2/3 mx-auto"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-1 bg-slate-300 rounded"></div>
                      <div className="h-1 bg-slate-300 rounded w-3/4"></div>
                      <div className="h-1 bg-slate-300 rounded w-1/2"></div>
                    </div>
                    <div className="mt-3 space-y-1">
                      <div className="h-1 bg-blue-600 rounded w-1/3"></div>
                      <div className="h-1 bg-slate-200 rounded"></div>
                      <div className="h-1 bg-slate-200 rounded w-4/5"></div>
                    </div>
                  </div>
                )}
                
                {template.id === "minimal" && (
                  <div className="bg-white h-full rounded-md shadow-sm p-3 text-xs">
                    <div className="mb-4">
                      <div className="h-2 bg-slate-800 rounded mb-1"></div>
                      <div className="h-1 bg-slate-600 rounded w-1/2"></div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="h-1 bg-slate-800 rounded w-1/4 mb-1"></div>
                        <div className="space-y-1">
                          <div className="h-1 bg-slate-300 rounded"></div>
                          <div className="h-1 bg-slate-300 rounded w-3/4"></div>
                        </div>
                      </div>
                      <div>
                        <div className="h-1 bg-slate-800 rounded w-1/3 mb-1"></div>
                        <div className="space-y-1">
                          <div className="h-1 bg-slate-300 rounded w-5/6"></div>
                          <div className="h-1 bg-slate-300 rounded w-2/3"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {template.id === "executive" && (
                  <div className="bg-white h-full rounded-md shadow-sm p-3 text-xs relative">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-600"></div>
                    <div className="pl-3">
                      <div className="mb-3">
                        <div className="h-2 bg-slate-800 rounded mb-1"></div>
                        <div className="h-1 bg-purple-600 rounded w-2/3"></div>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <div className="h-1 bg-purple-600 rounded w-1/4 mb-1"></div>
                          <div className="space-y-1">
                            <div className="h-1 bg-slate-300 rounded"></div>
                            <div className="h-1 bg-slate-300 rounded w-4/5"></div>
                          </div>
                        </div>
                        <div>
                          <div className="h-1 bg-purple-600 rounded w-1/3 mb-1"></div>
                          <div className="space-y-1">
                            <div className="h-1 bg-slate-300 rounded w-5/6"></div>
                            <div className="h-1 bg-slate-300 rounded w-2/3"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Selection indicator */}
                {value === template.id && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
              
              {/* Template Info */}
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">{template.name}</h4>
                <p className="text-sm text-slate-600 mb-3">{template.description}</p>
                <div className="flex items-center justify-between">
                  <Badge variant={template.badgeVariant} className="text-xs">
                    {template.badge}
                  </Badge>
                  {value === template.id && (
                    <Badge className="bg-blue-600 text-white text-xs">
                      Selected
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
