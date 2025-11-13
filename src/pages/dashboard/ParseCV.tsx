import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Download,
  Eye,
  Copy,
} from "lucide-react";
import { useState } from "react";

const ParseCV = () => {
  const [file, setFile] = useState<File | null>(null);
  const [parsing, setParsing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null); // Clear previous result
    }
  };

  const handleParse = async () => {
    if (!file) return;

    setParsing(true);

    // Simulate API call - replace with actual API call
    setTimeout(() => {
      setResult({
        id: "parse_abc123",
        candidate: {
          name: "Sarah Johnson",
          email: "sarah.johnson@email.com",
          phone: "+1-555-0123",
          location: { city: "San Francisco", state: "CA", country: "USA" },
          skills: ["Python", "React", "TypeScript", "Node.js", "AWS", "Docker"],
          experience: [
            {
              title: "Senior Software Engineer",
              company: "TechCorp",
              start_date: "2021-03-01",
              end_date: "2024-11-01",
              duration_months: 44,
              description: "Led development of microservices architecture"
            },
            {
              title: "Software Engineer",
              company: "StartupXYZ",
              start_date: "2019-01-01",
              end_date: "2021-02-28",
              duration_months: 26,
              description: "Full-stack development using React and Node.js"
            }
          ],
          education: [
            {
              institution: "Stanford University",
              degree: "BS",
              field: "Computer Science",
              graduation_date: "2018-06-01"
            }
          ],
          certifications: ["AWS Certified Solutions Architect"],
        },
        confidence: {
          overall: 0.94,
          contact: 0.98,
          experience: 0.92,
          education: 0.96,
          skills: 0.91
        }
      });
      setParsing(false);
    }, 2000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Parse CV</h1>
          <p className="text-muted-foreground">
            Upload a single CV to extract structured data
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload CV
              </CardTitle>
              <CardDescription>
                Supported formats: PDF, DOCX, DOC, TXT (max 10MB)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <input
                  type="file"
                  id="cv-upload"
                  accept=".pdf,.docx,.doc,.txt"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="cv-upload"
                  className="cursor-pointer flex flex-col items-center gap-3"
                >
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <FileText className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Click to upload or drag and drop</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      PDF, DOCX, DOC, or TXT up to 10MB
                    </p>
                  </div>
                </label>
              </div>

              {file && (
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium text-sm">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setFile(null)}
                  >
                    Remove
                  </Button>
                </div>
              )}

              <Button
                onClick={handleParse}
                disabled={!file || parsing}
                className="w-full"
                size="lg"
              >
                {parsing ? "Parsing..." : "Parse CV"}
              </Button>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-muted-foreground">This Month</p>
                  <p className="text-2xl font-bold">156</p>
                  <p className="text-xs text-muted-foreground">parses used</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Remaining</p>
                  <p className="text-2xl font-bold">844</p>
                  <p className="text-xs text-muted-foreground">in your plan</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Parse Results
              </CardTitle>
              <CardDescription>
                Extracted structured data from the CV
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!result && (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Upload and parse a CV to see results here</p>
                </div>
              )}

              {result && (
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="json">Raw JSON</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4 mt-4">
                    {/* Confidence Scores */}
                    <div className="flex items-center gap-2 mb-4">
                      <Badge className="bg-success/10 text-success border-success/20">
                        {(result.confidence.overall * 100).toFixed(1)}% Confidence
                      </Badge>
                    </div>

                    {/* Basic Info */}
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Name</p>
                        <p className="font-medium">{result.candidate.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{result.candidate.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="font-medium">{result.candidate.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Location</p>
                        <p className="font-medium">
                          {result.candidate.location.city}, {result.candidate.location.state}
                        </p>
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="pt-4 border-t">
                      <p className="text-sm text-muted-foreground mb-2">Skills ({result.candidate.skills.length})</p>
                      <div className="flex flex-wrap gap-2">
                        {result.candidate.skills.map((skill: string, idx: number) => (
                          <Badge key={idx} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Experience */}
                    <div className="pt-4 border-t">
                      <p className="text-sm text-muted-foreground mb-3">
                        Experience ({result.candidate.experience.length})
                      </p>
                      <div className="space-y-3">
                        {result.candidate.experience.map((exp: any, idx: number) => (
                          <div key={idx} className="text-sm">
                            <p className="font-medium">{exp.title}</p>
                            <p className="text-muted-foreground">{exp.company}</p>
                            <p className="text-xs text-muted-foreground">
                              {exp.duration_months} months
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Education */}
                    <div className="pt-4 border-t">
                      <p className="text-sm text-muted-foreground mb-3">Education</p>
                      <div className="text-sm">
                        <p className="font-medium">
                          {result.candidate.education[0].degree} {result.candidate.education[0].field}
                        </p>
                        <p className="text-muted-foreground">
                          {result.candidate.education[0].institution}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button variant="outline" className="flex-1">
                        <Download className="w-4 h-4 mr-2" />
                        Download JSON
                      </Button>
                      <Button variant="outline" className="flex-1">
                        Score Candidate
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="json" className="mt-4">
                    <div className="relative">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(JSON.stringify(result, null, 2))}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <pre className="bg-code rounded-lg p-4 text-xs overflow-auto max-h-96 text-code-foreground">
                        {JSON.stringify(result, null, 2)}
                      </pre>
                    </div>
                  </TabsContent>
                </Tabs>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ParseCV;
