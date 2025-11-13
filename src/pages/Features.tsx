import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Brain, 
  Shield, 
  Zap, 
  GitBranch, 
  BarChart3,
  CheckCircle2,
  Globe,
  Lock,
  Code2
} from "lucide-react";

const detailedFeatures = [
  {
    icon: FileText,
    title: "Advanced CV Parsing",
    description: "Extract structured data from any resume format with industry-leading accuracy.",
    features: [
      "Multi-format support: PDF, DOCX, DOC, TXT",
      "98.5% accuracy on contact information",
      "85%+ accuracy on work experience and education",
      "Handles multi-page documents and varied layouts",
      "Date parsing with ISO normalization",
      "Skill taxonomy mapping with synonyms",
    ],
  },
  {
    icon: Brain,
    title: "AI-Powered Scoring",
    description: "Score candidates against job profiles using transparent, explainable algorithms.",
    features: [
      "Deterministic baseline scoring (reproducible)",
      "Optional LLM-enhanced rationale",
      "Component scores: Skills, Experience, Education, Certs",
      "Risk flag generation (gaps, tenure volatility)",
      "Custom weighting support",
      "Bounded AI adjustments with guardrails",
    ],
  },
  {
    icon: Shield,
    title: "Audit & Compliance",
    description: "Built for compliance with transparent, versioned rules and GDPR-ready privacy.",
    features: [
      "Score breakdown with weights",
      "Versioned rules and models",
      "Deterministic job profile hashing",
      "PII minimization by default",
      "Regional storage (UK/EU)",
      "No protected characteristic inference",
    ],
  },
  {
    icon: Zap,
    title: "Performance",
    description: "Lightning-fast processing with built-in caching and optimized infrastructure.",
    features: [
      "P95 parse time < 2.5s (no LLM)",
      "P95 score time < 1.5s baseline",
      "SHA-256 file-hash caching",
      "Job profile normalization cache",
      "Graceful LLM degradation",
      "Stateless, horizontally scalable",
    ],
  },
  {
    icon: Code2,
    title: "Developer Experience",
    description: "First-class developer tools with clear documentation and easy integration.",
    features: [
      "OpenAPI specification",
      "Interactive Redoc UI",
      "Code examples (cURL, Python, TypeScript)",
      "Postman collection",
      "Consistent error envelopes",
      "Sandbox mode for testing",
    ],
  },
  {
    icon: BarChart3,
    title: "Analytics & Observability",
    description: "Complete visibility into API usage, performance, and quality metrics.",
    features: [
      "Request counts and latency tracking",
      "Success/error rate monitoring",
      "Parse quality metrics",
      "LLM cost and time tracking",
      "Distributed tracing with spans",
      "Structured logging with request IDs",
    ],
  },
];

const securityFeatures = [
  {
    icon: Lock,
    title: "Security-First Architecture",
    items: [
      "TLS everywhere with centralized gateway",
      "Bearer API key authentication",
      "Argon2id/bcrypt key hashing",
      "Rate limiting per key and endpoint",
      "File size and page caps",
      "Input validation and anti-abuse checks",
    ],
  },
  {
    icon: Globe,
    title: "Privacy & Data Protection",
    items: [
      "persist=false by default",
      "PII redaction in logs",
      "S3-compatible encryption at rest",
      "Row-level encryption in Postgres",
      "Regional storage compliance",
      "Deletion endpoints for GDPR",
    ],
  },
];

const FeaturesPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-4 text-center">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Features</Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Production-Grade CV Parsing & Scoring
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Enterprise features designed for scale. From prototype to production, Qualifyr.AI provides everything you need to build intelligent hiring tools.
            </p>
          </div>
        </section>

        {/* Detailed Features */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {detailedFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card key={index} className="border-border">
                    <CardHeader>
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <CardTitle className="text-2xl">{feature.title}</CardTitle>
                      <CardDescription className="text-base">{feature.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {feature.features.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-muted-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                Enterprise-Grade Security
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Built with security and privacy at the core. GDPR-compliant, audit-ready, and production-hardened.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {securityFeatures.map((section, index) => {
                const Icon = section.icon;
                return (
                  <Card key={index} className="border-border">
                    <CardHeader>
                      <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                        <Icon className="w-6 h-6 text-accent" />
                      </div>
                      <CardTitle className="text-xl">{section.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {section.items.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-muted-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your Hiring Pipeline?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Choose the plan that fits your needs and start screening candidates faster.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/pricing"
                className="inline-flex items-center justify-center h-11 px-8 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 font-medium transition-colors"
              >
                Get Started
              </a>
              <a
                href="/pricing"
                className="inline-flex items-center justify-center h-11 px-8 rounded-md border-2 border-primary bg-background text-primary hover:bg-primary/5 font-medium transition-colors"
              >
                View Docs
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default FeaturesPage;
