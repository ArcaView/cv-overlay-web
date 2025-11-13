import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Download,
  Eye,
  Copy,
  Target,
  Plus,
  Briefcase,
} from "lucide-react";
import { useState } from "react";

const ParseCV = () => {
  const [file, setFile] = useState<File | null>(null);
  const [parsing, setParsing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [scoring, setScoring] = useState(false);
  const [scoreResult, setScoreResult] = useState<any>(null);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [roles, setRoles] = useState([
    { id: "1", title: "Senior Frontend Developer", department: "Engineering" },
    { id: "2", title: "Product Manager", department: "Product" },
  ]);
  const [newRoleDialogOpen, setNewRoleDialogOpen] = useState(false);
  const [newRoleTitle, setNewRoleTitle] = useState("");

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

  const handleCreateRole = () => {
    if (!newRoleTitle.trim()) return;
    const newRole = {
      id: Math.random().toString(36).substr(2, 9),
      title: newRoleTitle,
      department: "New",
    };
    setRoles([...roles, newRole]);
    setSelectedRole(newRole.id);
    setNewRoleTitle("");
    setNewRoleDialogOpen(false);
  };

  const handleScore = async () => {
    if (!result || !jobDescription.trim()) return;

    setScoring(true);

    // Simulate scoring API call - replace with actual API call
    setTimeout(() => {
      setScoreResult({
        overall_score: 87,
        fit: "excellent",
        breakdown: {
          skills: 92,
          experience: 85,
          education: 78,
          certifications: 95,
          stability: 88
        },
        risk_flags: [],
        rationale: `Strong match for the position. The candidate has ${result.candidate.experience.length} years of relevant experience with ${result.candidate.skills.length} key skills matching the requirements. Education background aligns well with the role.`,
        matched_skills: result.candidate.skills.slice(0, 4),
        missing_skills: ["Kubernetes", "GraphQL"]
      });
      setScoring(false);
    }, 1500);
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

              {/* Role Selection */}
              <div className="space-y-2 pt-4 border-t">
                <Label htmlFor="role-select">Attach to Role (Optional)</Label>
                <div className="flex gap-2">
                  <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger id="role-select" className="flex-1">
                      <SelectValue placeholder="Select a role..." />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.id} value={role.id}>
                          <div className="flex items-center gap-2">
                            <Briefcase className="w-3 h-3" />
                            {role.title}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Dialog open={newRoleDialogOpen} onOpenChange={setNewRoleDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New Role</DialogTitle>
                        <DialogDescription>
                          Quickly create a new role to attach this CV to.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="new-role-title">Role Title</Label>
                          <Input
                            id="new-role-title"
                            placeholder="e.g., Senior Software Engineer"
                            value={newRoleTitle}
                            onChange={(e) => setNewRoleTitle(e.target.value)}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setNewRoleDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleCreateRole} disabled={!newRoleTitle.trim()}>
                          Create Role
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                <p className="text-xs text-muted-foreground">
                  Organize CVs by attaching them to specific roles
                </p>
              </div>

              {/* Job Description */}
              <div className="space-y-2 pt-4 border-t">
                <Label htmlFor="job-description">
                  Job Description (Optional)
                </Label>
                <Textarea
                  id="job-description"
                  placeholder="Paste the job description here to score the candidate against the role..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  Add a job description to automatically score the candidate's fit
                </p>
              </div>

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
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="score">Score</TabsTrigger>
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

                  <TabsContent value="score" className="space-y-4 mt-4">
                    {!jobDescription && (
                      <div className="text-center py-12 text-muted-foreground">
                        <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>Add a job description to score this candidate</p>
                        <p className="text-sm mt-1">Scroll up to the upload section to add job requirements</p>
                      </div>
                    )}

                    {jobDescription && !scoreResult && (
                      <div className="text-center py-8">
                        <Button
                          onClick={handleScore}
                          disabled={scoring}
                          size="lg"
                        >
                          {scoring ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 mr-2 animate-spin" />
                              Scoring...
                            </>
                          ) : (
                            <>
                              <Target className="w-4 h-4 mr-2" />
                              Score Candidate
                            </>
                          )}
                        </Button>
                      </div>
                    )}

                    {scoreResult && (
                      <div className="space-y-4">
                        {/* Overall Score */}
                        <div className="text-center p-6 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg border">
                          <p className="text-sm text-muted-foreground mb-2">Overall Match Score</p>
                          <p className="text-5xl font-bold text-primary mb-2">{scoreResult.overall_score}</p>
                          <Badge
                            className={
                              scoreResult.fit === 'excellent'
                                ? 'bg-success/10 text-success border-success/20'
                                : scoreResult.fit === 'good'
                                ? 'bg-primary/10 text-primary border-primary/20'
                                : 'bg-warning/10 text-warning border-warning/20'
                            }
                          >
                            {scoreResult.fit.toUpperCase()} FIT
                          </Badge>
                        </div>

                        {/* Score Breakdown */}
                        <div className="space-y-3">
                          <p className="font-medium">Score Breakdown</p>
                          {Object.entries(scoreResult.breakdown).map(([key, value]: [string, any]) => (
                            <div key={key}>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="capitalize">{key}</span>
                                <span className="font-medium">{value}/100</span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${
                                    value >= 85 ? 'bg-success' : value >= 70 ? 'bg-primary' : 'bg-warning'
                                  }`}
                                  style={{ width: `${value}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Rationale */}
                        <div className="pt-4 border-t">
                          <p className="font-medium mb-2">Rationale</p>
                          <p className="text-sm text-muted-foreground">{scoreResult.rationale}</p>
                        </div>

                        {/* Matched Skills */}
                        <div className="pt-4 border-t">
                          <p className="font-medium mb-2">Matched Skills</p>
                          <div className="flex flex-wrap gap-2">
                            {scoreResult.matched_skills.map((skill: string, idx: number) => (
                              <Badge key={idx} className="bg-success/10 text-success border-success/20">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Missing Skills */}
                        {scoreResult.missing_skills.length > 0 && (
                          <div className="pt-4 border-t">
                            <p className="font-medium mb-2">Missing Skills</p>
                            <div className="flex flex-wrap gap-2">
                              {scoreResult.missing_skills.map((skill: string, idx: number) => (
                                <Badge key={idx} variant="secondary">
                                  <AlertCircle className="w-3 h-3 mr-1" />
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex gap-2 pt-4">
                          <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => setScoreResult(null)}
                          >
                            Score Again
                          </Button>
                          <Button variant="outline" className="flex-1">
                            <Download className="w-4 h-4 mr-2" />
                            Export Score
                          </Button>
                        </div>
                      </div>
                    )}
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
