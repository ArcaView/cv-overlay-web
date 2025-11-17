import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  TrendingUp,
  Users,
  FileText,
  Award,
  Calendar,
  ArrowUpRight,
  Clock,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRoles } from "@/contexts/RolesContext";
import { useToast } from "@/hooks/use-toast";
import { generateAllCandidatesPDF } from "@/lib/allCandidatesPDF";

const Overview = () => {
  const navigate = useNavigate();
  const { roles } = useRoles();
  const { toast } = useToast();
  const [scoreCandidateDialogOpen, setScoreCandidateDialogOpen] = useState(false);

  // Get all candidates from all roles
  const allCandidates = roles.flatMap(role =>
    (role.candidatesList || []).map(candidate => ({
      ...candidate,
      roleTitle: role.title,
      roleId: role.id
    }))
  );

  const handleUploadNewCV = () => {
    navigate('/dashboard/parse');
  };

  const handleViewAllCandidates = () => {
    navigate('/dashboard/candidates');
  };

  const handleDownloadReport = async () => {
    toast({
      title: "Generating Report",
      description: "Creating comprehensive overview of all candidates...",
      duration: 3000,
    });

    await new Promise(resolve => setTimeout(resolve, 1500));

    generateAllCandidatesPDF({ roles });

    toast({
      title: "Report Ready",
      description: `Downloaded complete overview with ${allCandidates.length} candidates across ${roles.length} roles`,
    });
  };

  const handleScoreCandidateSelect = (candidate: any) => {
    setScoreCandidateDialogOpen(false);
    // Navigate to the role details page where the candidate is located
    navigate(`/dashboard/roles/${candidate.roleId}`);
    toast({
      title: "Candidate Selected",
      description: `Viewing ${candidate.name} in ${candidate.roleTitle}`,
    });
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
            <p className="text-muted-foreground">
              Here's what's happening with your hiring process today.
            </p>
          </div>
          <Badge className="bg-success/10 text-success border-success/20">
            Pro Plan • Active
          </Badge>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-6" data-tour="stats-overview">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                CVs Processed
              </CardDescription>
              <CardTitle className="text-3xl">156</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-1 text-xs text-success">
                <TrendingUp className="w-3 h-3" />
                <span>+12% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Candidates Scored
              </CardDescription>
              <CardTitle className="text-3xl">91</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-1 text-xs text-success">
                <TrendingUp className="w-3 h-3" />
                <span>+8% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <Award className="w-4 h-4" />
                Top Matches
              </CardDescription>
              <CardTitle className="text-3xl">23</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                Candidates scored 85+
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Avg. Processing Time
              </CardDescription>
              <CardTitle className="text-3xl">1.8s</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-success">
                Excellent performance
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your latest candidate evaluations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Sarah Johnson", score: 92, role: "Senior Developer", time: "5 min ago" },
                  { name: "Michael Chen", score: 88, role: "Product Manager", time: "12 min ago" },
                  { name: "Emily Watson", score: 85, role: "UX Designer", time: "28 min ago" },
                  { name: "James Rodriguez", score: 78, role: "Marketing Lead", time: "1 hour ago" },
                  { name: "Lisa Anderson", score: 91, role: "Data Scientist", time: "2 hours ago" },
                ].map((candidate, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-3 border-b last:border-0"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{candidate.name}</p>
                      <p className="text-sm text-muted-foreground">{candidate.role}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={candidate.score >= 85 ? "default" : "secondary"}
                        className={
                          candidate.score >= 85
                            ? "bg-success/10 text-success border-success/20"
                            : ""
                        }
                      >
                        Score: {candidate.score}
                      </Badge>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {candidate.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="space-y-6">
            <Card data-tour="quick-actions">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Common tasks and shortcuts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full justify-between"
                  variant="outline"
                  onClick={handleUploadNewCV}
                >
                  <span>Upload New CV</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Button>
                <Button
                  className="w-full justify-between"
                  variant="outline"
                  onClick={() => setScoreCandidateDialogOpen(true)}
                  disabled={allCandidates.length === 0}
                >
                  <span>Score Candidate</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Button>
                <Button
                  className="w-full justify-between"
                  variant="outline"
                  onClick={handleViewAllCandidates}
                >
                  <span>View All Candidates</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Button>
                <Button
                  className="w-full justify-between"
                  variant="outline"
                  onClick={handleDownloadReport}
                  disabled={allCandidates.length === 0}
                >
                  <span>Download Report</span>
                  <Sparkles className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>

            {/* Usage Overview */}
            <Card>
              <CardHeader>
                <CardTitle>This Month's Usage</CardTitle>
                <CardDescription>
                  Your plan limits and usage
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2 text-sm">
                    <span className="text-muted-foreground">CV Parses</span>
                    <span className="font-medium">156 / 25,000</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: "0.6%" }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2 text-sm">
                    <span className="text-muted-foreground">Scores</span>
                    <span className="font-medium">91 / 12,500</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-accent h-2 rounded-full"
                      style={{ width: "0.7%" }}
                    />
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Resets in</span>
                    </div>
                    <span className="font-medium">18 days</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Performance Insights */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Insights</CardTitle>
            <CardDescription>
              Key metrics and trends for this month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-success" />
                  High-Quality Matches
                </div>
                <p className="text-2xl font-bold">23 candidates</p>
                <p className="text-sm text-muted-foreground">
                  Scored 85 or above - ready for interview
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  Average Match Score
                </div>
                <p className="text-2xl font-bold">76.8</p>
                <p className="text-sm text-muted-foreground">
                  +3.2 points from last month
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                  Time Saved
                </div>
                <p className="text-2xl font-bold">~52 hours</p>
                <p className="text-sm text-muted-foreground">
                  Estimated manual review time saved
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Score Candidate Dialog */}
        <Dialog open={scoreCandidateDialogOpen} onOpenChange={setScoreCandidateDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle>Select Candidate to Score</DialogTitle>
              <DialogDescription>
                Choose a candidate from the list below to view their AI-powered score and details
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 space-y-2 overflow-y-auto max-h-[60vh]">
              {allCandidates.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No candidates available yet</p>
                  <p className="text-sm mt-2">Upload and parse CVs to see candidates here</p>
                </div>
              ) : (
                allCandidates
                  .sort((a, b) => (b.score || 0) - (a.score || 0))
                  .map((candidate) => (
                    <Card
                      key={candidate.id}
                      className="cursor-pointer hover:bg-accent/50 transition-colors"
                      onClick={() => handleScoreCandidateSelect(candidate)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold">{candidate.name}</h4>
                              {candidate.score && (
                                <Badge
                                  variant={candidate.score >= 85 ? "default" : "secondary"}
                                  className={
                                    candidate.score >= 85
                                      ? "bg-success/10 text-success border-success/20"
                                      : ""
                                  }
                                >
                                  {candidate.score}%
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-1">
                              {candidate.roleTitle}
                            </p>
                            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                              <span>{candidate.email}</span>
                              <span>•</span>
                              <span>{candidate.experience_years} years exp</span>
                              {candidate.fit && (
                                <>
                                  <span>•</span>
                                  <span className="capitalize">{candidate.fit}</span>
                                </>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {candidate.skills.slice(0, 4).map((skill: string) => (
                                <Badge key={skill} variant="outline" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                              {candidate.skills.length > 4 && (
                                <Badge variant="outline" className="text-xs">
                                  +{candidate.skills.length - 4}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <ArrowUpRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                        </div>
                      </CardContent>
                    </Card>
                  ))
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Overview;
