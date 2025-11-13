import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Brain, Shield, Zap, GitBranch, BarChart3 } from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Multi-Format Parsing",
    description: "Extract structured data from PDF, DOCX, DOC, and TXT files with 98.5% accuracy. Handles varied layouts, multi-page resumes, and noisy formatting.",
  },
  {
    icon: Brain,
    title: "AI-Powered Scoring",
    description: "Score candidates against job profiles using deterministic baseline algorithms or optional LLM-enhanced scoring with explainable rationale.",
  },
  {
    icon: Shield,
    title: "Audit-Ready & Fair",
    description: "Full transparency with score breakdowns, versioned rules, and reproducible results. Built for compliance with GDPR and bias-free hiring practices.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "P95 parse time under 2.5s, P95 score under 1.5s. Built-in caching and optimized infrastructure for production workloads.",
  },
  {
    icon: GitBranch,
    title: "Developer Experience",
    description: "OpenAPI spec, interactive docs, code examples in Python/TypeScript/cURL. Integrate in under an hour with clear error handling.",
  },
  {
    icon: BarChart3,
    title: "Analytics & Insights",
    description: "Track API usage, latency metrics, success rates, and parse quality. Built-in observability with request tracing and detailed logs.",
  },
];

export const Features = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Everything You Need to Build Smarter Hiring Tools
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Production-grade infrastructure with enterprise features. From MVP to millions of CVs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="border-border hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
