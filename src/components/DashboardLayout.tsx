import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Code2,
  Settings,
  BarChart3,
  CreditCard,
  Briefcase,
  FileText,
  Upload,
  Users,
} from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
}

const navItems = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Business metrics and insights",
  },
  {
    title: "Parse CV",
    href: "/dashboard/parse",
    icon: FileText,
    description: "Parse a single CV",
  },
  {
    title: "Bulk Parse",
    href: "/dashboard/bulk-parse",
    icon: Upload,
    description: "Parse multiple CVs",
  },
  {
    title: "Open Roles",
    href: "/dashboard/roles",
    icon: Briefcase,
    description: "Manage open positions",
  },
  {
    title: "Candidates",
    href: "/dashboard/candidates",
    icon: Users,
    description: "View all candidates",
  },
  {
    title: "Developer",
    href: "/dashboard/developer",
    icon: Code2,
    description: "API keys and documentation",
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
    description: "Recruitment and API analytics",
  },
  {
    title: "Billing",
    href: "/dashboard/billing",
    icon: CreditCard,
    description: "Subscription and invoices",
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    description: "Account preferences",
  },
];

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 flex">
        {/* Sidebar */}
        <aside className="w-64 border-r border-border bg-muted/30 hidden md:block">
          <div className="sticky top-16 p-6 space-y-1">
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-1">Dashboard</h2>
              <p className="text-sm text-muted-foreground">
                Manage your account
              </p>
            </div>

            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground font-medium"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <div className="flex-1">
                      <div>{item.title}</div>
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Mobile Navigation */}
        <div className="md:hidden w-full border-b border-border bg-background">
          <div className="overflow-x-auto">
            <nav className="flex gap-1 p-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground font-medium"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {item.title}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>

      <Footer />
    </div>
  );
};
