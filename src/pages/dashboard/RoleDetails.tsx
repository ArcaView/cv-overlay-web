import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Briefcase,
  MapPin,
  DollarSign,
  Calendar,
  ArrowLeft,
  Users,
  Star,
  FileText,
  Mail,
  Phone,
  Trash2,
  Eye,
} from "lucide-react";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  fileName: string;
  score?: number;
  fit?: 'excellent' | 'good' | 'fair';
  appliedDate: string;
  skills: string[];
  experience_years: number;
}

const RoleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data - replace with actual data fetching
  const [role] = useState({
    id: id,
    title: 'Senior Frontend Developer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    salary: '$120k - $160k',
    description: 'We are looking for an experienced frontend developer with React expertise to join our growing team. The ideal candidate will have strong experience with modern web technologies and a passion for creating exceptional user experiences.',
    status: 'active' as const,
    createdAt: '2024-01-15',
  });

  const [candidates] = useState<Candidate[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+1-555-0123',
      fileName: 'sarah_johnson_resume.pdf',
      score: 87,
      fit: 'excellent',
      appliedDate: '2024-01-20',
      skills: ['React', 'TypeScript', 'Node.js', 'AWS'],
      experience_years: 5,
    },
    {
      id: '2',
      name: 'Michael Chen',
      email: 'michael.chen@email.com',
      phone: '+1-555-0124',
      fileName: 'michael_chen_cv.pdf',
      score: 92,
      fit: 'excellent',
      appliedDate: '2024-01-19',
      skills: ['React', 'Vue.js', 'TypeScript', 'Docker'],
      experience_years: 7,
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      email: 'emily.r@email.com',
      phone: '+1-555-0125',
      fileName: 'emily_rodriguez_resume.pdf',
      score: 76,
      fit: 'good',
      appliedDate: '2024-01-18',
      skills: ['React', 'JavaScript', 'CSS', 'Git'],
      experience_years: 3,
    },
  ]);

  const sortedCandidates = [...candidates].sort((a, b) => (b.score || 0) - (a.score || 0));

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
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/roles')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Roles
          </Button>
        </div>

        {/* Role Info Card */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <CardTitle className="text-2xl">{role.title}</CardTitle>
                  <Badge variant={role.status === 'active' ? 'default' : 'secondary'}>
                    {role.status}
                  </Badge>
                </div>
                <CardDescription className="flex flex-wrap gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-4 h-4" />
                    {role.department}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {role.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {role.type}
                  </span>
                  {role.salary && (
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      {role.salary}
                    </span>
                  )}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">{role.description}</p>
            <div className="flex items-center gap-6 pt-4 border-t">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">{candidates.length}</span>
                <span className="text-sm text-muted-foreground">candidates</span>
              </div>
              <div className="text-xs text-muted-foreground">
                Created {new Date(role.createdAt).toLocaleDateString()}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Candidates List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Candidates</h2>
            <span className="text-sm text-muted-foreground">
              Sorted by match score
            </span>
          </div>

          {candidates.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No candidates yet</h3>
                <p className="text-muted-foreground mb-4">
                  Parse CVs and attach them to this role to see candidates here
                </p>
                <div className="flex gap-2 justify-center">
                  <Button onClick={() => navigate('/dashboard/parse')}>
                    <FileText className="w-4 h-4 mr-2" />
                    Parse CV
                  </Button>
                  <Button variant="outline" onClick={() => navigate('/dashboard/bulk-parse')}>
                    Bulk Parse
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            sortedCandidates.map((candidate, index) => (
              <Card key={candidate.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      {/* Rank Badge */}
                      {index === 0 && candidate.score && candidate.score >= 85 && (
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center">
                            <Star className="w-5 h-5 text-white fill-white" />
                          </div>
                        </div>
                      )}
                      {(!candidate.score || candidate.score < 85 || index > 0) && (
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-lg font-semibold">
                            {index + 1}
                          </div>
                        </div>
                      )}

                      {/* Candidate Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold">{candidate.name}</h3>
                          {candidate.fit && (
                            <Badge className={getFitColor(candidate.fit)} variant="secondary">
                              {candidate.fit}
                            </Badge>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-3">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {candidate.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {candidate.phone}
                          </span>
                          <span className="flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            {candidate.fileName}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-3">
                          {candidate.skills.slice(0, 5).map((skill) => (
                            <Badge key={skill} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {candidate.skills.length > 5 && (
                            <Badge variant="outline" className="text-xs">
                              +{candidate.skills.length - 5} more
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{candidate.experience_years} years experience</span>
                          <span>Applied {new Date(candidate.appliedDate).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {/* Score */}
                      {candidate.score && (
                        <div className="flex-shrink-0 text-right">
                          <div className="text-3xl font-bold bg-gradient-to-br from-primary to-primary/60 bg-clip-text text-transparent">
                            {candidate.score}%
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">Match Score</p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RoleDetails;
