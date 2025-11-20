import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  ArrowLeft,
  Mail,
  Phone,
  FileText,
  Calendar,
  Clock,
  Edit,
  Trash2,
  Plus,
  Save,
  X,
} from "lucide-react";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRoles, type Interview } from "@/contexts/RolesContext";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { ScoreBreakdownCard } from "@/components/ScoreBreakdownCard";

const CandidateDetail = () => {
  const { candidateId, roleId } = useParams();
  const navigate = useNavigate();
  const { roles, updateCandidateStatus, updateCandidateSummary, addInterview, updateInterview, deleteInterview } = useRoles();
  const { toast } = useToast();

  // Find the role and candidate
  const role = roles.find(r => r.id === roleId);
  const candidate = role?.candidatesList.find(c => c.id === candidateId);

  // State management
  const [editingSummary, setEditingSummary] = useState(false);
  const [summaryText, setSummaryText] = useState(candidate?.summary || '');
  const [interviewDialogOpen, setInterviewDialogOpen] = useState(false);
  const [editingInterview, setEditingInterview] = useState<Interview | null>(null);
  const [deleteInterviewId, setDeleteInterviewId] = useState<string | null>(null);
  const [interviewForm, setInterviewForm] = useState({
    date: '',
    interviewer: '',
    notes: '',
    type: 'technical' as Interview['type']
  });

  if (!role || !candidate) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <Button variant="ghost" onClick={() => navigate('/dashboard/candidates')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Candidates
          </Button>
          <Card className="mt-4">
            <CardContent className="py-12 text-center">
              <h3 className="text-lg font-semibold mb-2">Candidate not found</h3>
              <p className="text-muted-foreground">
                The candidate you're looking for doesn't exist.
              </p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const handleStatusChange = (newStatus: typeof candidate.status) => {
    if (roleId && candidateId) {
      updateCandidateStatus(roleId, candidateId, newStatus);
      toast({
        title: "Status Updated",
        description: `${candidate.name}'s status changed to ${getStatusLabel(newStatus)}`,
      });
    }
  };

  const handleSaveSummary = () => {
    if (roleId && candidateId) {
      updateCandidateSummary(roleId, candidateId, summaryText);
      setEditingSummary(false);
      toast({
        title: "Summary Updated",
        description: "Candidate summary has been saved",
      });
    }
  };

  const handleAddInterview = () => {
    setEditingInterview(null);
    setInterviewForm({
      date: '',
      interviewer: '',
      notes: '',
      type: 'technical'
    });
    setInterviewDialogOpen(true);
  };

  const handleEditInterview = (interview: Interview) => {
    setEditingInterview(interview);
    setInterviewForm({
      date: interview.date,
      interviewer: interview.interviewer,
      notes: interview.notes,
      type: interview.type
    });
    setInterviewDialogOpen(true);
  };

  const handleSaveInterview = () => {
    if (!roleId || !candidateId) return;

    if (editingInterview) {
      // Update existing interview
      updateInterview(roleId, candidateId, editingInterview.id, interviewForm);
      toast({
        title: "Interview Updated",
        description: "Interview notes have been updated",
      });
    } else {
      // Add new interview
      addInterview(roleId, candidateId, interviewForm);
      toast({
        title: "Interview Added",
        description: "New interview has been recorded",
      });
    }

    setInterviewDialogOpen(false);
  };

  const handleDeleteInterview = () => {
    if (roleId && candidateId && deleteInterviewId) {
      deleteInterview(roleId, candidateId, deleteInterviewId);
      setDeleteInterviewId(null);
      toast({
        title: "Interview Deleted",
        description: "Interview has been removed",
      });
    }
  };

  const getStatusColor = (status: typeof candidate.status) => {
    switch (status) {
      case 'new': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
      case 'reviewing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'shortlisted': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400';
      case 'interviewing': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'offered': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      case 'hired': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getStatusLabel = (status: typeof candidate.status) => {
    switch (status) {
      case 'new': return 'New';
      case 'reviewing': return 'Reviewing';
      case 'shortlisted': return 'Shortlisted';
      case 'interviewing': return 'Interviewing';
      case 'offered': return 'Offered';
      case 'hired': return 'Hired';
      case 'rejected': return 'Rejected';
      default: return status;
    }
  };

  const getInterviewTypeLabel = (type: Interview['type']) => {
    switch (type) {
      case 'phone_screen': return 'Phone Screen';
      case 'technical': return 'Technical';
      case 'behavioral': return 'Behavioral';
      case 'final': return 'Final';
      case 'other': return 'Other';
      default: return type;
    }
  };

  const getFitColor = (fit?: string) => {
    switch (fit) {
      case 'excellent': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'good': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'fair': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/dashboard/candidates')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to All Candidates
          </Button>
        </div>

        {/* Candidate Info Card */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl mb-2">{candidate.name}</CardTitle>
                <CardDescription className="flex items-center gap-2 text-base">
                  Applied for: <span className="font-medium text-foreground">{role.title}</span>
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                {candidate.fit && (
                  <Badge className={getFitColor(candidate.fit)} variant="secondary">
                    {candidate.fit}
                  </Badge>
                )}
                <Badge className={getStatusColor(candidate.status)} variant="secondary">
                  {getStatusLabel(candidate.status)}
                </Badge>
                {candidate.score && (
                  <div className="text-3xl font-bold bg-gradient-to-br from-primary to-primary/60 bg-clip-text text-transparent">
                    {candidate.score}%
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span>{candidate.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span>{candidate.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <span>{candidate.experience_years} years exp</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>Applied {new Date(candidate.appliedDate).toLocaleDateString()}</span>
              </div>
            </div>

            <div>
              <Label className="text-xs text-muted-foreground">Skills</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {candidate.skills.map((skill) => (
                  <Badge key={skill} variant="outline">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-xs text-muted-foreground">Resume File</Label>
              <p className="text-sm mt-1">{candidate.fileName}</p>
            </div>

            <div>
              <Label className="text-xs text-muted-foreground">Current Status</Label>
              <Select
                value={candidate.status}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger className="w-[250px] mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="reviewing">Reviewing</SelectItem>
                  <SelectItem value="shortlisted">Shortlisted</SelectItem>
                  <SelectItem value="interviewing">Interviewing</SelectItem>
                  <SelectItem value="offered">Offered</SelectItem>
                  <SelectItem value="hired">Hired</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Score Breakdown */}
        {candidate.score_breakdown && (
          <ScoreBreakdownCard
            scoreBreakdown={candidate.score_breakdown}
            totalScore={candidate.score}
          />
        )}

        {/* Status History */}
        <Card>
          <CardHeader>
            <CardTitle>Status History</CardTitle>
            <CardDescription>Timeline of status changes for this candidate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[...candidate.statusHistory].reverse().map((entry, index) => (
                <div key={index} className="flex items-start gap-4 p-3 rounded-lg bg-muted/30">
                  <div className="flex-shrink-0">
                    <Badge className={getStatusColor(entry.status)} variant="secondary">
                      {getStatusLabel(entry.status)}
                    </Badge>
                  </div>
                  <div className="flex-1">
                    {entry.note && (
                      <p className="text-sm font-medium mb-1">{entry.note}</p>
                    )}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>{formatDistanceToNow(new Date(entry.changedAt), { addSuffix: true })}</span>
                      <span>•</span>
                      <span>{new Date(entry.changedAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Interviews */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Interviews</CardTitle>
                <CardDescription>Schedule and track interview sessions</CardDescription>
              </div>
              <Button onClick={handleAddInterview}>
                <Plus className="w-4 h-4 mr-2" />
                Add Interview
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {candidate.interviews.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                <p>No interviews scheduled yet</p>
                <p className="text-sm mt-2">Click "Add Interview" to schedule one</p>
              </div>
            ) : (
              <div className="space-y-3">
                {candidate.interviews.map((interview) => (
                  <Card key={interview.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">{getInterviewTypeLabel(interview.type)}</Badge>
                            <span className="text-sm text-muted-foreground">
                              {new Date(interview.date).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm font-medium mb-2">Interviewer: {interview.interviewer}</p>
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{interview.notes}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditInterview(interview)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteInterviewId(interview.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Candidate Summary */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Candidate Summary</CardTitle>
                <CardDescription>Overall notes and assessment</CardDescription>
              </div>
              {!editingSummary && (
                <Button variant="outline" onClick={() => setEditingSummary(true)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {editingSummary ? (
              <div className="space-y-4">
                <Textarea
                  value={summaryText}
                  onChange={(e) => setSummaryText(e.target.value)}
                  placeholder="Add your overall assessment and notes about this candidate..."
                  className="min-h-[150px]"
                />
                <div className="flex gap-2">
                  <Button onClick={handleSaveSummary}>
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSummaryText(candidate.summary);
                      setEditingSummary(false);
                    }}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-sm whitespace-pre-wrap">
                {candidate.summary || (
                  <p className="text-muted-foreground italic">No summary added yet</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Interview Dialog */}
        <Dialog open={interviewDialogOpen} onOpenChange={setInterviewDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingInterview ? 'Edit Interview' : 'Add Interview'}</DialogTitle>
              <DialogDescription>
                {editingInterview ? 'Update interview details' : 'Schedule a new interview'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={interviewForm.date}
                  onChange={(e) => setInterviewForm({ ...interviewForm, date: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="interviewer">Interviewer</Label>
                <Input
                  id="interviewer"
                  value={interviewForm.interviewer}
                  onChange={(e) => setInterviewForm({ ...interviewForm, interviewer: e.target.value })}
                  placeholder="Enter interviewer name"
                />
              </div>
              <div>
                <Label htmlFor="type">Interview Type</Label>
                <Select
                  value={interviewForm.type}
                  onValueChange={(value: Interview['type']) => setInterviewForm({ ...interviewForm, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="phone_screen">Phone Screen</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="behavioral">Behavioral</SelectItem>
                    <SelectItem value="final">Final</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={interviewForm.notes}
                  onChange={(e) => setInterviewForm({ ...interviewForm, notes: e.target.value })}
                  placeholder="Enter interview notes and feedback..."
                  className="min-h-[120px]"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setInterviewDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveInterview}>
                {editingInterview ? 'Update' : 'Add'} Interview
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Interview Dialog */}
        <AlertDialog open={!!deleteInterviewId} onOpenChange={(open) => !open && setDeleteInterviewId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Interview</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this interview? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteInterview} className="bg-destructive text-destructive-foreground">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
};

export default CandidateDetail;
