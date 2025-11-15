import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Brain, Shield, Zap, Users, BarChart3 } from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Smart Resume Parsing",
    description: "Automatically extract key information from any resume format with 98.5% accuracy. Handles PDFs, Word documents, and varied layouts seamlessly.",
  },
  {
    icon: Brain,
    title: "AI-Powered Candidate Scoring",
    description: "Instantly score candidates against your job requirements with transparent AI. Get detailed breakdowns showing skills match, experience fit, and education alignment.",
  },
  {
    icon: Shield,
    title: "Fair & Compliant Hiring",
    description: "Built-in bias prevention and transparent scoring ensures fair hiring practices. Fully GDPR-compliant with audit trails for every decision.",
  },
  {
    icon: Zap,
    title: "Instant Results",
    description: "Screen hundreds of candidates in seconds, not days. Our AI delivers accurate scoring in real-time, helping you identify top talent immediately.",
  },
  {
    icon: Users,
    title: "Collaborative Workflow",
    description: "Share candidate profiles, compare shortlists, and collaborate with your hiring team. Everyone stays aligned with centralized candidate data.",
  },
  {
    icon: BarChart3,
    title: "Recruitment Analytics",
    description: "Track hiring pipeline metrics, time-to-hire, candidate quality, and team performance. Make data-driven decisions to improve your recruitment process.",
  },
];

export const Features = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Everything You Need for Modern Recruitment
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful features that help you hire better, faster, and smarter—all in one platform.
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
