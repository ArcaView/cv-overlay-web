import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Users, Check } from "lucide-react";

interface MockUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  role: "admin" | "user";
}

const MOCK_USERS: MockUser[] = [
  {
    id: "admin-1",
    firstName: "Admin",
    lastName: "User",
    email: "admin@qualifyr.ai",
    company: "Qualifyr.AI",
    role: "admin",
  },
  {
    id: "user-1",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    company: "Acme Corp",
    role: "user",
  },
  {
    id: "user-2",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@techco.com",
    company: "TechCo",
    role: "user",
  },
  {
    id: "user-3",
    firstName: "Bob",
    lastName: "Johnson",
    email: "bob@startup.io",
    company: "Startup Inc",
    role: "user",
  },
];

interface DevAccountSwitcherProps {
  onUserChange: (user: MockUser | null) => void;
  currentUserId: string | null;
}

export const DevAccountSwitcher = ({ onUserChange, currentUserId }: DevAccountSwitcherProps) => {
  // Only show in development
  if (import.meta.env.PROD) {
    return null;
  }

  const currentUser = MOCK_USERS.find((u) => u.id === currentUserId);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 shadow-lg bg-yellow-50 border-yellow-300 hover:bg-yellow-100 dark:bg-yellow-950 dark:border-yellow-700"
          >
            <Users className="w-4 h-4" />
            <span className="font-mono text-xs">
              {currentUser ? currentUser.firstName : "Guest"}
            </span>
            <Badge variant="secondary" className="text-xs">
              DEV
            </Badge>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel>Switch Test Account</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => onUserChange(null)}>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-xs">👤</span>
                </div>
                <div>
                  <div className="font-medium">Guest (Logged Out)</div>
                  <div className="text-xs text-muted-foreground">No account</div>
                </div>
              </div>
              {!currentUserId && <Check className="w-4 h-4 text-primary" />}
            </div>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {MOCK_USERS.map((user) => (
            <DropdownMenuItem key={user.id} onClick={() => onUserChange(user)}>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    user.role === "admin" ? "bg-primary/10" : "bg-secondary"
                  }`}>
                    <span className="text-xs">
                      {user.role === "admin" ? "👑" : "👤"}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium flex items-center gap-2">
                      {user.firstName} {user.lastName}
                      {user.role === "admin" && (
                        <Badge variant="default" className="text-xs">Admin</Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">{user.email}</div>
                  </div>
                </div>
                {currentUserId === user.id && <Check className="w-4 h-4 text-primary" />}
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export { MOCK_USERS };
export type { MockUser };
