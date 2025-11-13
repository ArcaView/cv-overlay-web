import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

export const HowItWorks = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            From Resume to Insights in Two API Calls
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Simple, predictable workflow that integrates seamlessly with your existing stack.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative">
              <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
                <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Step 1</Badge>
                <h3 className="text-2xl font-bold mb-3">Upload CV</h3>
                <p className="text-muted-foreground mb-4">
                  POST your CV file (PDF, DOCX, DOC, TXT) to <code className="text-sm bg-code px-2 py-1 rounded">/api/parse</code>
                </p>
                <div className="bg-code rounded-lg p-3 text-xs font-mono">
                  <div className="text-muted-foreground mb-1">$ curl -X POST \</div>
                  <div className="text-muted-foreground">-H "Authorization: Bearer KEY" \</div>
                  <div className="text-muted-foreground">-F "file=@resume.pdf"</div>
                </div>
              </div>
              <div className="hidden md:flex absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                <ArrowRight className="w-8 h-8 text-primary" />
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
                <Badge className="mb-4 bg-accent/10 text-accent border-accent/20">Step 2</Badge>
                <h3 className="text-2xl font-bold mb-3">Get Structured Data</h3>
                <p className="text-muted-foreground mb-4">
                  Receive normalized JSON with contact info, skills, experience, education, and confidence scores.
                </p>
                <div className="bg-code rounded-lg p-3 text-xs font-mono">
                  <div className="text-code-foreground">{`{`}</div>
                  <div className="text-code-foreground ml-2">"name": "Jane Doe",</div>
                  <div className="text-code-foreground ml-2">"skills": ["Python"],</div>
                  <div className="text-code-foreground ml-2">"experience": [...]</div>
                  <div className="text-code-foreground">{`}`}</div>
                </div>
              </div>
              <div className="hidden md:flex absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                <ArrowRight className="w-8 h-8 text-accent" />
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
              <Badge className="mb-4 bg-success/10 text-success border-success/20">Step 3</Badge>
              <h3 className="text-2xl font-bold mb-3">Score & Rank</h3>
              <p className="text-muted-foreground mb-4">
                POST candidate + job profile to <code className="text-sm bg-code px-2 py-1 rounded">/api/score</code> for instant fit analysis.
              </p>
              <div className="bg-code rounded-lg p-3 text-xs font-mono">
                <div className="text-code-foreground">{`{`}</div>
                <div className="text-code-foreground ml-2">"overall_score": 87,</div>
                <div className="text-code-foreground ml-2">"fit": "excellent",</div>
                <div className="text-code-foreground ml-2">"rationale": "..."</div>
                <div className="text-code-foreground">{`}`}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
