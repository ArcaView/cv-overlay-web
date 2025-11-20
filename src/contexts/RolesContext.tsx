import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export interface Interview {
  id: string;
  date: string;
  interviewer: string;
  notes: string;
  type: 'phone_screen' | 'technical' | 'behavioral' | 'final' | 'other';
}

export interface StatusHistoryEntry {
  status: 'new' | 'reviewing' | 'shortlisted' | 'interviewing' | 'offered' | 'hired' | 'rejected';
  changedAt: string;
  note?: string;
}

export interface PrestigeDetails {
  company_prestige: number;
  university_prestige: number;
  role_level_prestige: number;
  top_companies?: Array<{
    company: string;
    score: number;
    tier: string;
  }>;
  top_universities?: Array<{
    university: string;
    score: number;
    tier: string;
  }>;
  top_roles?: Array<{
    role: string;
    score: number;
    level: string;
  }>;
}

export interface ScoreBreakdown {
  skills?: number;
  experience?: number;
  prestige?: number;
  education?: number;
  certifications?: number;
  stability?: number;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  fileName: string;
  score?: number;
  score_breakdown?: ScoreBreakdown;
  prestige_score?: number;
  prestige_contribution?: number;
  prestige_details?: PrestigeDetails;
  fit?: 'excellent' | 'good' | 'fair';
  appliedDate: string;
  skills: string[];
  experience_years: number;
  status: 'new' | 'reviewing' | 'shortlisted' | 'interviewing' | 'offered' | 'hired' | 'rejected';
  statusHistory: StatusHistoryEntry[];
  interviews: Interview[];
  summary: string;
  // Additional CV fields
  location?: string;
  linkedin_url?: string;
  portfolio_url?: string;
  experience?: any[];
  education?: any[];
  certifications?: any[];
  languages?: any[];
  cv_parsed_data?: any;
}

export interface Role {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  candidates: number; // Legacy: count of candidates (computed from candidatesList.length)
  candidatesList: Candidate[]; // Actual candidate data
  createdAt: string;
  status: 'active' | 'inactive';
}

interface RolesContextType {
  roles: Role[];
  setRoles: React.Dispatch<React.SetStateAction<Role[]>>;
  isLoading: boolean;
  error: string | null;
  refreshRoles: () => Promise<void>;
  updateRole: (id: string, updates: Partial<Role>) => Promise<void>;
  deleteRole: (id: string) => Promise<void>;
  addCandidateToRole: (roleId: string, candidate: Candidate) => Promise<void>;
  removeCandidateFromRole: (roleId: string, candidateId: string) => Promise<void>;
  updateCandidateStatus: (roleId: string, candidateId: string, status: Candidate['status'], note?: string) => Promise<void>;
  updateCandidateSummary: (roleId: string, candidateId: string, summary: string) => Promise<void>;
  addInterview: (roleId: string, candidateId: string, interview: Omit<Interview, 'id'>) => Promise<void>;
  updateInterview: (roleId: string, candidateId: string, interviewId: string, updates: Partial<Interview>) => Promise<void>;
  deleteInterview: (roleId: string, candidateId: string, interviewId: string) => Promise<void>;
  addRole: (role: Omit<Role, 'id' | 'candidatesList' | 'candidates' | 'createdAt' | 'status'>) => Promise<void>;
}

const RolesContext = createContext<RolesContextType | undefined>(undefined);

// Helper function to transform database candidates to Role format
const transformCandidatesForRole = (candidates: any[]): { candidatesList: Candidate[], candidates: number } => {
  const candidatesList = candidates.map(c => ({
    id: c.id,
    name: c.name,
    email: c.email || '',
    phone: c.phone || '',
    fileName: c.cv_file_name || 'CV',
    score: c.overall_score,
    score_breakdown: c.cv_parsed_data?.score_breakdown,
    prestige_score: c.cv_parsed_data?.prestige_score,
    prestige_contribution: c.cv_parsed_data?.prestige_contribution,
    prestige_details: c.cv_parsed_data?.prestige_details,
    fit: c.overall_score >= 80 ? 'excellent' as const : c.overall_score >= 60 ? 'good' as const : 'fair' as const,
    appliedDate: c.created_at.split('T')[0],
    skills: Array.isArray(c.skills) ? c.skills : [],
    experience_years: c.cv_parsed_data?.experience_years || 0,
    status: c.status || 'new',
    statusHistory: c.cv_parsed_data?.status_history || [{ status: c.status || 'new', changedAt: c.created_at }],
    interviews: Array.isArray(c.interview_notes) ? c.interview_notes : [],
    summary: c.notes || '',
    // Additional CV fields
    location: c.location,
    linkedin_url: c.linkedin_url,
    portfolio_url: c.portfolio_url,
    experience: Array.isArray(c.experience) ? c.experience : [],
    education: Array.isArray(c.education) ? c.education : [],
    certifications: Array.isArray(c.certifications) ? c.certifications : [],
    languages: Array.isArray(c.languages) ? c.languages : [],
    cv_parsed_data: c.cv_parsed_data
  }));

  return {
    candidatesList,
    candidates: candidatesList.length
  };
};

export const RolesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch roles from database
  const refreshRoles = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setRoles([]);
        return;
      }

      // Fetch roles
      const { data: rolesData, error: rolesError } = await supabase
        .from('roles')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (rolesError) throw rolesError;

      // Fetch candidates for all roles
      const { data: candidatesData, error: candidatesError } = await supabase
        .from('candidates')
        .select('*')
        .eq('user_id', user.id);

      if (candidatesError) throw candidatesError;

      // Transform data to match Role interface
      const transformedRoles: Role[] = (rolesData || []).map(role => {
        const roleCandidates = (candidatesData || []).filter(c => c.role_id === role.id);
        const { candidatesList, candidates } = transformCandidatesForRole(roleCandidates);

        return {
          id: role.id,
          title: role.title,
          department: role.department || '',
          location: role.location || '',
          type: role.employment_type || '',
          salary: role.salary_min && role.salary_max
            ? `${role.salary_currency || '£'}${role.salary_min} - ${role.salary_currency || '£'}${role.salary_max}`
            : '',
          description: role.description || '',
          candidates,
          candidatesList,
          createdAt: role.created_at.split('T')[0],
          status: role.is_active ? 'active' : 'inactive'
        };
      });

      setRoles(transformedRoles);
    } catch (err: any) {
      setError(err.message);
      toast({
        title: 'Error loading roles',
        description: err.message,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load roles on mount
  useEffect(() => {
    refreshRoles();
  }, []);

  const updateRole = async (id: string, updates: Partial<Role>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const dbUpdates: any = {};
      if (updates.title) dbUpdates.title = updates.title;
      if (updates.department) dbUpdates.department = updates.department;
      if (updates.location) dbUpdates.location = updates.location;
      if (updates.type) dbUpdates.employment_type = updates.type;
      if (updates.description) dbUpdates.description = updates.description;
      if (updates.status) dbUpdates.is_active = updates.status === 'active';

      const { error } = await supabase
        .from('roles')
        .update(dbUpdates)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      // Update local state optimistically
      setRoles(prev => prev.map(role =>
        role.id === id ? { ...role, ...updates } : role
      ));

      toast({
        title: 'Role updated',
        description: 'Role has been updated successfully'
      });
    } catch (err: any) {
      toast({
        title: 'Error updating role',
        description: err.message,
        variant: 'destructive'
      });
      throw err;
    }
  };

  const deleteRole = async (id: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('roles')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setRoles(prev => prev.filter(role => role.id !== id));

      toast({
        title: 'Role deleted',
        description: 'Role has been deleted successfully'
      });
    } catch (err: any) {
      toast({
        title: 'Error deleting role',
        description: err.message,
        variant: 'destructive'
      });
      throw err;
    }
  };

  const addCandidateToRole = async (roleId: string, candidate: Candidate) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('candidates')
        .insert({
          user_id: user.id,
          role_id: roleId,
          name: candidate.name,
          email: candidate.email,
          phone: candidate.phone,
          cv_file_name: candidate.fileName,
          overall_score: candidate.score,
          skills: candidate.skills,
          status: candidate.status,
          notes: candidate.summary,
          interview_notes: candidate.interviews,
          cv_parsed_data: {
            score_breakdown: candidate.score_breakdown,
            prestige_score: candidate.prestige_score,
            prestige_contribution: candidate.prestige_contribution,
            prestige_details: candidate.prestige_details,
            experience_years: candidate.experience_years,
            status_history: candidate.statusHistory
          }
        })
        .select()
        .single();

      if (error) throw error;

      // Update local state
      setRoles(prev => prev.map(role => {
        if (role.id === roleId) {
          const updatedCandidatesList = [...role.candidatesList, { ...candidate, id: data.id }];
          return {
            ...role,
            candidatesList: updatedCandidatesList,
            candidates: updatedCandidatesList.length,
          };
        }
        return role;
      }));

      toast({
        title: 'Candidate added',
        description: 'Candidate has been added successfully'
      });
    } catch (err: any) {
      toast({
        title: 'Error adding candidate',
        description: err.message,
        variant: 'destructive'
      });
      throw err;
    }
  };

  const removeCandidateFromRole = async (roleId: string, candidateId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('candidates')
        .delete()
        .eq('id', candidateId)
        .eq('user_id', user.id);

      if (error) throw error;

      setRoles(prev => prev.map(role => {
        if (role.id === roleId) {
          const updatedCandidatesList = role.candidatesList.filter(c => c.id !== candidateId);
          return {
            ...role,
            candidatesList: updatedCandidatesList,
            candidates: updatedCandidatesList.length,
          };
        }
        return role;
      }));

      toast({
        title: 'Candidate removed',
        description: 'Candidate has been removed successfully'
      });
    } catch (err: any) {
      toast({
        title: 'Error removing candidate',
        description: err.message,
        variant: 'destructive'
      });
      throw err;
    }
  };

  const updateCandidateStatus = async (roleId: string, candidateId: string, status: Candidate['status'], note?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get current candidate data to update status history
      const role = roles.find(r => r.id === roleId);
      const candidate = role?.candidatesList.find(c => c.id === candidateId);

      if (!candidate) throw new Error('Candidate not found');

      const newHistoryEntry: StatusHistoryEntry = {
        status,
        changedAt: new Date().toISOString(),
        note
      };

      const updatedStatusHistory = [...candidate.statusHistory, newHistoryEntry];

      const { error } = await supabase
        .from('candidates')
        .update({
          status,
          cv_parsed_data: {
            ...(candidate.cv_parsed_data || {}),
            status_history: updatedStatusHistory
          }
        })
        .eq('id', candidateId)
        .eq('user_id', user.id);

      if (error) throw error;

      setRoles(prev => prev.map(role => {
        if (role.id === roleId) {
          const updatedCandidatesList = role.candidatesList.map(c => {
            if (c.id === candidateId) {
              return {
                ...c,
                status,
                statusHistory: updatedStatusHistory
              };
            }
            return c;
          });
          return {
            ...role,
            candidatesList: updatedCandidatesList,
          };
        }
        return role;
      }));

      toast({
        title: 'Status updated',
        description: 'Candidate status has been updated successfully'
      });
    } catch (err: any) {
      toast({
        title: 'Error updating status',
        description: err.message,
        variant: 'destructive'
      });
      throw err;
    }
  };

  const updateCandidateSummary = async (roleId: string, candidateId: string, summary: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('candidates')
        .update({ notes: summary })
        .eq('id', candidateId)
        .eq('user_id', user.id);

      if (error) throw error;

      setRoles(prev => prev.map(role => {
        if (role.id === roleId) {
          const updatedCandidatesList = role.candidatesList.map(candidate =>
            candidate.id === candidateId ? { ...candidate, summary } : candidate
          );
          return {
            ...role,
            candidatesList: updatedCandidatesList,
          };
        }
        return role;
      }));

      toast({
        title: 'Summary updated',
        description: 'Candidate summary has been updated successfully'
      });
    } catch (err: any) {
      toast({
        title: 'Error updating summary',
        description: err.message,
        variant: 'destructive'
      });
      throw err;
    }
  };

  const addInterview = async (roleId: string, candidateId: string, interview: Omit<Interview, 'id'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const role = roles.find(r => r.id === roleId);
      const candidate = role?.candidatesList.find(c => c.id === candidateId);

      if (!candidate) throw new Error('Candidate not found');

      const newInterview: Interview = {
        ...interview,
        id: `int_${Math.random().toString(36).substr(2, 9)}`
      };

      const updatedInterviews = [...candidate.interviews, newInterview];

      const { error } = await supabase
        .from('candidates')
        .update({ interview_notes: updatedInterviews })
        .eq('id', candidateId)
        .eq('user_id', user.id);

      if (error) throw error;

      setRoles(prev => prev.map(role => {
        if (role.id === roleId) {
          const updatedCandidatesList = role.candidatesList.map(c => {
            if (c.id === candidateId) {
              return {
                ...c,
                interviews: updatedInterviews
              };
            }
            return c;
          });
          return {
            ...role,
            candidatesList: updatedCandidatesList,
          };
        }
        return role;
      }));

      toast({
        title: 'Interview added',
        description: 'Interview note has been added successfully'
      });
    } catch (err: any) {
      toast({
        title: 'Error adding interview',
        description: err.message,
        variant: 'destructive'
      });
      throw err;
    }
  };

  const updateInterview = async (roleId: string, candidateId: string, interviewId: string, updates: Partial<Interview>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const role = roles.find(r => r.id === roleId);
      const candidate = role?.candidatesList.find(c => c.id === candidateId);

      if (!candidate) throw new Error('Candidate not found');

      const updatedInterviews = candidate.interviews.map(interview =>
        interview.id === interviewId ? { ...interview, ...updates } : interview
      );

      const { error } = await supabase
        .from('candidates')
        .update({ interview_notes: updatedInterviews })
        .eq('id', candidateId)
        .eq('user_id', user.id);

      if (error) throw error;

      setRoles(prev => prev.map(role => {
        if (role.id === roleId) {
          const updatedCandidatesList = role.candidatesList.map(c => {
            if (c.id === candidateId) {
              return {
                ...c,
                interviews: updatedInterviews
              };
            }
            return c;
          });
          return {
            ...role,
            candidatesList: updatedCandidatesList,
          };
        }
        return role;
      }));

      toast({
        title: 'Interview updated',
        description: 'Interview note has been updated successfully'
      });
    } catch (err: any) {
      toast({
        title: 'Error updating interview',
        description: err.message,
        variant: 'destructive'
      });
      throw err;
    }
  };

  const deleteInterview = async (roleId: string, candidateId: string, interviewId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const role = roles.find(r => r.id === roleId);
      const candidate = role?.candidatesList.find(c => c.id === candidateId);

      if (!candidate) throw new Error('Candidate not found');

      const updatedInterviews = candidate.interviews.filter(interview => interview.id !== interviewId);

      const { error } = await supabase
        .from('candidates')
        .update({ interview_notes: updatedInterviews })
        .eq('id', candidateId)
        .eq('user_id', user.id);

      if (error) throw error;

      setRoles(prev => prev.map(role => {
        if (role.id === roleId) {
          const updatedCandidatesList = role.candidatesList.map(c => {
            if (c.id === candidateId) {
              return {
                ...c,
                interviews: updatedInterviews
              };
            }
            return c;
          });
          return {
            ...role,
            candidatesList: updatedCandidatesList,
          };
        }
        return role;
      }));

      toast({
        title: 'Interview deleted',
        description: 'Interview note has been deleted successfully'
      });
    } catch (err: any) {
      toast({
        title: 'Error deleting interview',
        description: err.message,
        variant: 'destructive'
      });
      throw err;
    }
  };

  const addRole = async (roleData: Omit<Role, 'id' | 'candidatesList' | 'candidates' | 'createdAt' | 'status'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Parse salary if provided
      let salary_min, salary_max;
      if (roleData.salary) {
        const salaryMatch = roleData.salary.match(/[\d,]+/g);
        if (salaryMatch && salaryMatch.length >= 2) {
          salary_min = parseFloat(salaryMatch[0].replace(/,/g, ''));
          salary_max = parseFloat(salaryMatch[1].replace(/,/g, ''));
        }
      }

      const { data, error } = await supabase
        .from('roles')
        .insert({
          user_id: user.id,
          title: roleData.title,
          department: roleData.department,
          location: roleData.location,
          employment_type: roleData.type,
          salary_min,
          salary_max,
          description: roleData.description,
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;

      const newRole: Role = {
        ...roleData,
        id: data.id,
        candidatesList: [],
        candidates: 0,
        createdAt: data.created_at.split('T')[0],
        status: 'active',
      };

      setRoles(prev => [...prev, newRole]);

      toast({
        title: 'Role created',
        description: 'Role has been created successfully'
      });
    } catch (err: any) {
      toast({
        title: 'Error creating role',
        description: err.message,
        variant: 'destructive'
      });
      throw err;
    }
  };

  return (
    <RolesContext.Provider value={{
      roles,
      setRoles,
      isLoading,
      error,
      refreshRoles,
      updateRole,
      deleteRole,
      addCandidateToRole,
      removeCandidateFromRole,
      updateCandidateStatus,
      updateCandidateSummary,
      addInterview,
      updateInterview,
      deleteInterview,
      addRole
    }}>
      {children}
    </RolesContext.Provider>
  );
};

export const useRoles = () => {
  const context = useContext(RolesContext);
  if (context === undefined) {
    throw new Error('useRoles must be used within a RolesProvider');
  }
  return context;
};
