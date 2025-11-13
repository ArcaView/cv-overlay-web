import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background via-primary/5 to-background py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-accent/10 border border-accent/20">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-foreground">AI-Powered CV Parsing & Scoring</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Parse CVs. Score Candidates.
            <span className="block text-primary mt-2">Ship Faster.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl">
            Developer-first API that transforms resumes into structured JSON and scores candidate fit with transparent, explainable AI. Integrate in minutes, scale to millions.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Button asChild size="lg" variant="hero">
              <Link to="/docs">
                Get Started <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/pricing">View Pricing</Link>
            </Button>
          </div>

          <div className="w-full bg-card rounded-xl shadow-xl border border-border p-6 md:p-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-code rounded-lg p-4 text-left">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 rounded-full bg-destructive"></div>
                  <div className="w-3 h-3 rounded-full bg-warning"></div>
                  <div className="w-3 h-3 rounded-full bg-success"></div>
                  <span className="ml-auto text-xs text-muted-foreground font-mono">POST /api/parse</span>
                </div>
                <pre className="text-sm font-mono text-code-foreground overflow-x-auto">
{`{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "skills": ["Python", "FastAPI"],
  "experience": [{
    "title": "Senior Engineer",
    "company": "TechCorp",
    "duration_months": 36
  }]
}`}
                </pre>
              </div>
              
              <div className="bg-code rounded-lg p-4 text-left">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 rounded-full bg-destructive"></div>
                  <div className="w-3 h-3 rounded-full bg-warning"></div>
                  <div className="w-3 h-3 rounded-full bg-success"></div>
                  <span className="ml-auto text-xs text-muted-foreground font-mono">POST /api/score</span>
                </div>
                <pre className="text-sm font-mono text-code-foreground overflow-x-auto">
{`{
  "overall_score": 87,
  "breakdown": {
    "skills": 92,
    "experience": 85,
    "education": 78
  },
  "fit": "excellent"
}`}
                </pre>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-8 mt-12 text-sm text-muted-foreground">
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-foreground">98.5%</span>
              <span>Parsing Accuracy</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-foreground">&lt;2.5s</span>
              <span>P95 Response Time</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-foreground">99.5%</span>
              <span>API Uptime</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
