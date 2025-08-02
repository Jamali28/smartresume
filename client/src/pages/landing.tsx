import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Brain, 
  Palette, 
  Download, 
  Mail, 
  History, 
  Smartphone,
  Sparkles,
  Rocket,
  Play,
  Check,
  X,
  Star
} from "lucide-react";

export default function Landing() {
  const handleGetStarted = () => {
    window.location.href = "/api/login";
  };

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Generation",
      description: "GPT-4 analyzes job descriptions and crafts personalized resumes that match employer requirements perfectly.",
      color: "text-blue-600"
    },
    {
      icon: Palette,
      title: "Professional Templates",
      description: "Choose from modern, ATS-friendly templates designed by career experts and loved by recruiters.",
      color: "text-emerald-600"
    },
    {
      icon: Download,
      title: "One-Click Export",
      description: "Download your resume as a professional PDF or share it directly with employers.",
      color: "text-purple-600"
    },
    {
      icon: Mail,
      title: "Cover Letter Generator",
      description: "Generate compelling cover letters with customizable tone - from formal to friendly.",
      color: "text-blue-600"
    },
    {
      icon: History,
      title: "Version History",
      description: "Keep track of all your resume versions and easily switch between different job applications.",
      color: "text-emerald-600"
    },
    {
      icon: Smartphone,
      title: "Mobile Optimized",
      description: "Build and edit your resume on any device with our fully responsive design.",
      color: "text-purple-600"
    }
  ];

  const pricingPlans = [
    {
      name: "Free",
      price: "$0",
      description: "Perfect for getting started",
      features: [
        "1 resume creation",
        "Basic AI optimization",
        "1 template option",
        "PDF export with watermark"
      ],
      unavailable: ["Cover letter generation"],
      buttonText: "Start Free",
      buttonVariant: "outline" as const,
      popular: false
    },
    {
      name: "Pro",
      price: "$19",
      period: "per month",
      description: "Most popular choice",
      features: [
        "Unlimited resumes",
        "Advanced AI optimization",
        "All template designs",
        "Clean PDF exports",
        "AI cover letter generation",
        "Version history"
      ],
      unavailable: [],
      buttonText: "Start Pro Trial",
      buttonVariant: "default" as const,
      popular: true
    },
    {
      name: "Enterprise",
      price: "$49",
      period: "per month",
      description: "For teams and professionals",
      features: [
        "Everything in Pro",
        "Priority AI processing",
        "Custom branding",
        "Analytics dashboard",
        "Team collaboration",
        "Priority support"
      ],
      unavailable: [],
      buttonText: "Contact Sales",
      buttonVariant: "outline" as const,
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">SmartResume</span>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-slate-600 hover:text-blue-600 transition-colors">Features</a>
              <a href="#templates" className="text-slate-600 hover:text-blue-600 transition-colors">Templates</a>
              <a href="#pricing" className="text-slate-600 hover:text-blue-600 transition-colors">Pricing</a>
            </nav>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={handleGetStarted}>
                Sign In
              </Button>
              <Button onClick={handleGetStarted} className="gradient-primary">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="secondary" className="mb-6 bg-purple-100 text-purple-700 hover:bg-purple-100">
                <Sparkles className="w-4 h-4 mr-2" />
                Powered by AI
              </Badge>
              <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 leading-tight mb-6">
                Land your next job with <span className="text-gradient">Smart AI</span>
              </h1>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Create personalized, job-targeted resumes and cover letters in minutes using GPT-4. 
                Stand out from the competition with AI-powered optimization.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  onClick={handleGetStarted}
                  className="gradient-primary text-white"
                >
                  <Rocket className="w-4 h-4 mr-2" />
                  Start Building Free
                </Button>
                <Button size="lg" variant="outline">
                  <Play className="w-4 h-4 mr-2" />
                  Watch Demo
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <Card className="shadow-2xl border-0">
                <CardContent className="p-0">
                  <div className="aspect-[4/3] bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
                    <div className="text-center p-8">
                      <div className="w-16 h-16 gradient-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-slate-900 mb-2">AI Resume Builder</h3>
                      <p className="text-slate-600">Intelligent optimization in progress...</p>
                      <div className="flex items-center justify-center mt-4 space-x-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse delay-100"></div>
                        <div className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse delay-200"></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-4 max-w-xs">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <Check className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Resume Generated!</p>
                    <p className="text-sm text-slate-600">Tailored for Software Engineer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Everything you need to land your dream job
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Our AI-powered platform creates personalized resumes and cover letters that get noticed by hiring managers.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-slate-50">
                <CardContent className="p-8">
                  <div className={`w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-6`}>
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">{feature.title}</h3>
                  <p className="text-slate-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Choose the plan that works for you
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Start free and upgrade when you need more features. No hidden fees, cancel anytime.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`shadow-lg border-2 ${plan.popular ? 'border-blue-500 relative' : 'border-slate-200'}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-600 text-white">Most Popular</Badge>
                  </div>
                )}
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                    <div className="text-4xl font-bold text-slate-900 mb-1">{plan.price}</div>
                    {plan.period && <p className="text-slate-600">{plan.period}</p>}
                    <p className="text-slate-600 mt-2">{plan.description}</p>
                  </div>
                  
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-3">
                        <Check className="w-5 h-5 text-emerald-600" />
                        <span className="text-slate-700">{feature}</span>
                      </li>
                    ))}
                    {plan.unavailable.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-3 opacity-50">
                        <X className="w-5 h-5 text-slate-400" />
                        <span className="text-slate-400">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full ${plan.popular ? 'gradient-primary text-white' : ''}`}
                    variant={plan.buttonVariant}
                    onClick={handleGetStarted}
                  >
                    {plan.buttonText}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-bold">SmartResume</span>
              </div>
              <p className="text-slate-300 mb-6 max-w-md">
                Land your next job with Smart AI. Create personalized, job-targeted resumes and cover letters that get noticed by hiring managers.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-3">
                <li><a href="#features" className="text-slate-300 hover:text-white transition-colors">Features</a></li>
                <li><a href="#templates" className="text-slate-300 hover:text-white transition-colors">Templates</a></li>
                <li><a href="#pricing" className="text-slate-300 hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-slate-300 hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="text-slate-300 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-slate-300 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 text-sm">© 2024 SmartResume. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
