import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Interview {
  id: string;
  date: string;
  interviewer: string;
  notes: string;
  type: 'phone_screen' | 'technical' | 'behavioral' | 'final' | 'other';
}

export interface StatusHistoryEntry {
  status: 'reviewing' | 'interviewing' | 'interviewed' | 'offer_outstanding' | 'hired' | 'rejected';
  changedAt: string;
  note?: string;
}

export interface Candidate {
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
  status: 'reviewing' | 'interviewing' | 'interviewed' | 'offer_outstanding' | 'hired' | 'rejected';
  statusHistory: StatusHistoryEntry[];
  interviews: Interview[];
  summary: string;
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
  updateRole: (id: string, updates: Partial<Role>) => void;
  deleteRole: (id: string) => void;
  addCandidateToRole: (roleId: string, candidate: Candidate) => void;
  removeCandidateFromRole: (roleId: string, candidateId: string) => void;
  updateCandidateStatus: (roleId: string, candidateId: string, status: Candidate['status'], note?: string) => void;
  updateCandidateSummary: (roleId: string, candidateId: string, summary: string) => void;
  addInterview: (roleId: string, candidateId: string, interview: Omit<Interview, 'id'>) => void;
  updateInterview: (roleId: string, candidateId: string, interviewId: string, updates: Partial<Interview>) => void;
  deleteInterview: (roleId: string, candidateId: string, interviewId: string) => void;
  addRole: (role: Omit<Role, 'id' | 'candidatesList' | 'candidates' | 'createdAt' | 'status'>) => void;
}

const RolesContext = createContext<RolesContextType | undefined>(undefined);

const initialRoles: Role[] = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    salary: '$120k - $160k',
    description: 'We are looking for an experienced frontend developer with React expertise...',
    candidates: 3,
    candidatesList: [
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
        status: 'interviewing',
        statusHistory: [
          { status: 'reviewing', changedAt: '2024-01-20T10:00:00Z' },
          { status: 'interviewing', changedAt: '2024-01-22T14:30:00Z', note: 'Moved to technical interview round' }
        ],
        interviews: [
          {
            id: 'int1',
            date: '2024-01-23',
            interviewer: 'John Smith',
            notes: 'Strong technical skills in React and TypeScript. Good problem-solving approach.',
            type: 'technical'
          }
        ],
        summary: 'Excellent frontend developer with 5 years of experience. Strong React and TypeScript skills.'
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
        status: 'offer_outstanding',
        statusHistory: [
          { status: 'reviewing', changedAt: '2024-01-19T09:00:00Z' },
          { status: 'interviewing', changedAt: '2024-01-20T11:00:00Z' },
          { status: 'interviewed', changedAt: '2024-01-24T16:00:00Z' },
          { status: 'offer_outstanding', changedAt: '2024-01-25T10:00:00Z', note: 'Offer sent pending acceptance' }
        ],
        interviews: [
          {
            id: 'int2',
            date: '2024-01-22',
            interviewer: 'Sarah Wilson',
            notes: 'Exceptional candidate. Very strong architecture knowledge and leadership experience.',
            type: 'technical'
          },
          {
            id: 'int3',
            date: '2024-01-24',
            interviewer: 'Mark Johnson',
            notes: 'Great cultural fit. Team collaboration skills are outstanding.',
            type: 'behavioral'
          }
        ],
        summary: 'Top-tier candidate with 7 years experience. Strong technical and leadership skills. Highly recommended for senior positions.'
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
        status: 'reviewing',
        statusHistory: [
          { status: 'reviewing', changedAt: '2024-01-18T08:00:00Z' }
        ],
        interviews: [],
        summary: 'Solid mid-level developer with good fundamentals. Would benefit from mentorship.'
      },
    ],
    createdAt: '2024-01-15',
    status: 'active',
  },
  {
    id: '2',
    title: 'Product Manager',
    department: 'Product',
    location: 'New York, NY',
    type: 'Full-time',
    salary: '$130k - $180k',
    description: 'Seeking a strategic product manager to lead our core product initiatives...',
    candidates: 0,
    candidatesList: [],
    createdAt: '2024-01-10',
    status: 'active',
  },
];

export const RolesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [roles, setRoles] = useState<Role[]>(initialRoles);

  const updateRole = (id: string, updates: Partial<Role>) => {
    setRoles(prev => prev.map(role =>
      role.id === id ? { ...role, ...updates } : role
    ));
  };

  const deleteRole = (id: string) => {
    setRoles(prev => prev.filter(role => role.id !== id));
  };

  const addCandidateToRole = (roleId: string, candidate: Candidate) => {
    setRoles(prev => prev.map(role => {
      if (role.id === roleId) {
        const updatedCandidatesList = [...role.candidatesList, candidate];
        return {
          ...role,
          candidatesList: updatedCandidatesList,
          candidates: updatedCandidatesList.length,
        };
      }
      return role;
    }));
  };

  const removeCandidateFromRole = (roleId: string, candidateId: string) => {
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
  };

  const updateCandidateStatus = (roleId: string, candidateId: string, status: Candidate['status'], note?: string) => {
    setRoles(prev => prev.map(role => {
      if (role.id === roleId) {
        const updatedCandidatesList = role.candidatesList.map(candidate => {
          if (candidate.id === candidateId) {
            const newHistoryEntry: StatusHistoryEntry = {
              status,
              changedAt: new Date().toISOString(),
              note
            };
            return {
              ...candidate,
              status,
              statusHistory: [...candidate.statusHistory, newHistoryEntry]
            };
          }
          return candidate;
        });
        return {
          ...role,
          candidatesList: updatedCandidatesList,
        };
      }
      return role;
    }));
  };

  const updateCandidateSummary = (roleId: string, candidateId: string, summary: string) => {
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
  };

  const addInterview = (roleId: string, candidateId: string, interview: Omit<Interview, 'id'>) => {
    setRoles(prev => prev.map(role => {
      if (role.id === roleId) {
        const updatedCandidatesList = role.candidatesList.map(candidate => {
          if (candidate.id === candidateId) {
            const newInterview: Interview = {
              ...interview,
              id: `int_${Math.random().toString(36).substr(2, 9)}`
            };
            return {
              ...candidate,
              interviews: [...candidate.interviews, newInterview]
            };
          }
          return candidate;
        });
        return {
          ...role,
          candidatesList: updatedCandidatesList,
        };
      }
      return role;
    }));
  };

  const updateInterview = (roleId: string, candidateId: string, interviewId: string, updates: Partial<Interview>) => {
    setRoles(prev => prev.map(role => {
      if (role.id === roleId) {
        const updatedCandidatesList = role.candidatesList.map(candidate => {
          if (candidate.id === candidateId) {
            const updatedInterviews = candidate.interviews.map(interview =>
              interview.id === interviewId ? { ...interview, ...updates } : interview
            );
            return {
              ...candidate,
              interviews: updatedInterviews
            };
          }
          return candidate;
        });
        return {
          ...role,
          candidatesList: updatedCandidatesList,
        };
      }
      return role;
    }));
  };

  const deleteInterview = (roleId: string, candidateId: string, interviewId: string) => {
    setRoles(prev => prev.map(role => {
      if (role.id === roleId) {
        const updatedCandidatesList = role.candidatesList.map(candidate => {
          if (candidate.id === candidateId) {
            const updatedInterviews = candidate.interviews.filter(interview => interview.id !== interviewId);
            return {
              ...candidate,
              interviews: updatedInterviews
            };
          }
          return candidate;
        });
        return {
          ...role,
          candidatesList: updatedCandidatesList,
        };
      }
      return role;
    }));
  };

  const addRole = (roleData: Omit<Role, 'id' | 'candidatesList' | 'candidates' | 'createdAt' | 'status'>) => {
    const newRole: Role = {
      ...roleData,
      id: Math.random().toString(36).substr(2, 9),
      candidatesList: [],
      candidates: 0,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'active',
    };
    setRoles(prev => [...prev, newRole]);
  };

  return (
    <RolesContext.Provider value={{
      roles,
      setRoles,
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
