import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Role {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  candidates: number;
  createdAt: string;
  status: 'active' | 'inactive';
}

interface RolesContextType {
  roles: Role[];
  setRoles: React.Dispatch<React.SetStateAction<Role[]>>;
  updateRole: (id: string, updates: Partial<Role>) => void;
  deleteRole: (id: string) => void;
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
    candidates: 12,
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
    candidates: 8,
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

  return (
    <RolesContext.Provider value={{ roles, setRoles, updateRole, deleteRole }}>
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
