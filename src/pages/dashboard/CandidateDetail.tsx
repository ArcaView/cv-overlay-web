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
        title: 'Status updated',
        description: `Candidate status changed to ${newStatus}`
      });
    }
  };

  const handleSaveSummary = () => {
    if (roleId && candidateId) {
      updateCandidateSummary(roleId, candidateId, summaryText);
      setEditingSummary(false);
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
      updateInterview(roleId, candidateId, editingInterview.id, interviewForm);
    } else {
      addInterview(roleId, candidateId, interviewForm);
    }

    setInterviewDialogOpen(false);
    setEditingInterview(null);
    setInterviewForm({
      date: '',
      interviewer: '',
      notes: '',
      type: 'technical'
    });
  };

  const handleDeleteInterview = () => {
    if (roleId && candidateId && deleteInterviewId) {
      deleteInterview(roleId, candidateId, deleteInterviewId);
      setDeleteInterviewId(null);
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

        {/* CV Details - All in One Interview Page */}
        <Card>
          <CardHeader>
            <CardTitle>📋 Interview Reference Sheet</CardTitle>
            <CardDescription>Complete candidate background - everything you need for the interview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Professional Summary */}
            {(candidate.cv_parsed_data?.summary || candidate.cv_parsed_data?.professional_summary || candidate.summary) && (
              <div>
                <h3 className="font-semibold mb-2 text-sm uppercase tracking-wide flex items-center gap-2">
                  <span className="text-lg">💼</span> Professional Summary
                </h3>
                <p className="text-sm leading-relaxed bg-muted/30 p-3 rounded-lg">
                  {candidate.cv_parsed_data?.summary || candidate.cv_parsed_data?.professional_summary || candidate.summary}
                </p>
              </div>
            )}

            {/* Key Skills */}
            {candidate.skills && candidate.skills.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2 text-sm uppercase tracking-wide flex items-center gap-2">
                  <span className="text-lg">🎯</span> Technical Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {candidate.skills.map((skill, idx) => (
                    <Badge key={idx} variant="secondary" className="text-sm">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Work Experience */}
            {candidate.experience && candidate.experience.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide flex items-center gap-2">
                  <span className="text-lg">💼</span> Work Experience
                </h3>
                <div className="space-y-6">
                  {candidate.experience.map((exp: any, index: number) => (
                    <div key={index} className="bg-muted/20 p-4 rounded-lg border-l-4 border-primary">
                      <div className="mb-3">
                        <h4 className="font-bold text-base text-foreground">
                          {exp.title || exp.role || exp.position || 'Position'}
                        </h4>
                        <p className="text-sm font-medium text-muted-foreground">
                          {exp.company || exp.employer || 'Company'}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          📅 {exp.start_date || exp.from || exp.startDate || ''} → {exp.end_date || exp.to || exp.endDate || 'Present'}
                          {exp.duration && ` (${exp.duration})`}
                        </p>
                      </div>

                      {exp.description && (
                        <div className="mb-3">
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">
                            {exp.description}
                          </p>
                        </div>
                      )}

                      {exp.responsibilities && Array.isArray(exp.responsibilities) && exp.responsibilities.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs font-semibold text-muted-foreground mb-2">📌 Key Responsibilities:</p>
                          <ul className="list-disc list-outside text-sm space-y-1 ml-5">
                            {exp.responsibilities.map((resp: string, idx: number) => (
                              <li key={idx} className="leading-relaxed">{resp}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {exp.achievements && Array.isArray(exp.achievements) && exp.achievements.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs font-semibold text-muted-foreground mb-2">🏆 Key Achievements:</p>
                          <ul className="list-disc list-outside text-sm space-y-1 ml-5">
                            {exp.achievements.map((achievement: string, idx: number) => (
                              <li key={idx} className="leading-relaxed">{achievement}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {exp.technologies && (
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground mb-1">🛠️ Technologies Used:</p>
                          <p className="text-sm">{Array.isArray(exp.technologies) ? exp.technologies.join(', ') : exp.technologies}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {candidate.education && candidate.education.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide flex items-center gap-2">
                  <span className="text-lg">🎓</span> Education
                </h3>
                <div className="space-y-3">
                  {candidate.education.map((edu: any, index: number) => (
                    <div key={index} className="bg-muted/20 p-3 rounded-lg">
                      <h4 className="font-bold text-base">
                        {edu.degree || edu.qualification || 'Degree'}
                      </h4>
                      <p className="text-sm font-medium text-muted-foreground">
                        {edu.institution || edu.school || edu.university || 'Institution'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        📅 {edu.start_date || edu.from || ''} {edu.start_date && edu.end_date && '→ '} {edu.graduation_date || edu.year || edu.end_date || ''}
                      </p>
                      {edu.field && (
                        <p className="text-sm mt-2">📚 Field: {edu.field}</p>
                      )}
                      {edu.gpa && (
                        <p className="text-sm">📊 GPA: {edu.gpa}</p>
                      )}
                      {edu.honors && (
                        <p className="text-sm">🏅 {edu.honors}</p>
                      )}
                      {edu.description && (
                        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{edu.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {candidate.certifications && candidate.certifications.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2 text-sm uppercase tracking-wide flex items-center gap-2">
                  <span className="text-lg">🏅</span> Certifications & Licenses
                </h3>
                <div className="space-y-2">
                  {candidate.certifications.map((cert: any, index: number) => (
                    <div key={index} className="text-sm bg-muted/20 p-2 rounded">
                      <span className="font-medium">
                        {typeof cert === 'string' ? cert : cert.name || cert.title || 'Certification'}
                      </span>
                      {cert.issuer && <span className="text-muted-foreground"> by {cert.issuer}</span>}
                      {cert.year && <span className="text-muted-foreground"> ({cert.year})</span>}
                      {cert.expiry && <span className="text-muted-foreground"> • Expires: {cert.expiry}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {candidate.languages && candidate.languages.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2 text-sm uppercase tracking-wide flex items-center gap-2">
                  <span className="text-lg">🌍</span> Languages
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {candidate.languages.map((lang: any, index: number) => (
                    <div key={index} className="text-sm bg-muted/20 p-2 rounded">
                      <span className="font-medium">
                        {typeof lang === 'string' ? lang : lang.name || lang.language || 'Language'}
                      </span>
                      {lang.proficiency && <span className="text-muted-foreground block text-xs">{lang.proficiency}</span>}
                      {lang.level && <span className="text-muted-foreground block text-xs">Level: {lang.level}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Interview Tips */}
            <div className="mt-6 p-4 bg-primary/5 rounded-lg border-2 border-primary/20">
              <h3 className="font-bold mb-2 text-sm flex items-center gap-2">
                <span className="text-lg">💡</span> Interview Question Ideas
              </h3>
              <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                <li>Ask about specific projects and responsibilities mentioned above</li>
                <li>Deep dive into technologies and skills - assess hands-on experience</li>
                <li>Discuss career transitions between roles/companies - motivation & growth</li>
                <li>Explore achievements and their measurable impact</li>
                <li>Ask about challenges faced and how they were overcome</li>
              </ul>
            </div>

            {/* Raw Data for Reference */}
            {candidate.cv_parsed_data && Object.keys(candidate.cv_parsed_data).filter(k => k !== 'status_history').length > 0 && (
              <details className="mt-6">
                <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">
                  🔍 View Raw CV Data (Technical Reference)
                </summary>
                <pre className="mt-3 p-4 bg-muted rounded-lg text-xs overflow-auto max-h-96 font-mono">
                  {JSON.stringify(candidate.cv_parsed_data, null, 2)}
                </pre>
              </details>
            )}
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

        {/* Summary/Notes */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Internal Notes</CardTitle>
                <CardDescription>Private notes about this candidate</CardDescription>
              </div>
              {!editingSummary && (
                <Button variant="outline" size="sm" onClick={() => setEditingSummary(true)}>
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
                  placeholder="Add notes about this candidate..."
                  className="min-h-[150px]"
                />
                <div className="flex gap-2">
                  <Button onClick={handleSaveSummary}>
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button variant="outline" onClick={() => {
                    setEditingSummary(false);
                    setSummaryText(candidate.summary || '');
                  }}>
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                {candidate.summary ? (
                  <p className="text-sm whitespace-pre-wrap">{candidate.summary}</p>
                ) : (
                  <p className="text-sm text-muted-foreground">No notes yet. Click "Edit" to add notes.</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

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

        {/* Interview Dialog */}
        <Dialog open={interviewDialogOpen} onOpenChange={setInterviewDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingInterview ? 'Edit Interview' : 'Add Interview'}</DialogTitle>
              <DialogDescription>
                {editingInterview ? 'Update interview details below' : 'Schedule a new interview for this candidate'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label>Interview Type</Label>
                <Select
                  value={interviewForm.type}
                  onValueChange={(value) => setInterviewForm({ ...interviewForm, type: value as Interview['type'] })}
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
                <Label>Date</Label>
                <Input
                  type="date"
                  value={interviewForm.date}
                  onChange={(e) => setInterviewForm({ ...interviewForm, date: e.target.value })}
                />
              </div>
              <div>
                <Label>Interviewer</Label>
                <Input
                  placeholder="Name of interviewer"
                  value={interviewForm.interviewer}
                  onChange={(e) => setInterviewForm({ ...interviewForm, interviewer: e.target.value })}
                />
              </div>
              <div>
                <Label>Notes</Label>
                <Textarea
                  placeholder="Interview notes, feedback, etc."
                  value={interviewForm.notes}
                  onChange={(e) => setInterviewForm({ ...interviewForm, notes: e.target.value })}
                  className="min-h-[100px]"
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

        {/* Delete Interview Confirmation */}
        <AlertDialog open={deleteInterviewId !== null} onOpenChange={() => setDeleteInterviewId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Interview</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this interview? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteInterview} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
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
