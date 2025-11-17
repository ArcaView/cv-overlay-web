import { ReactNode, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { resetOnboardingTour, OnboardingTour } from "@/components/OnboardingTour";
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
  Play,
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
  const navigate = useNavigate();
  const [runTour, setRunTour] = useState(false);

  // Check if tour should auto-start from sidebar button click
  useEffect(() => {
    console.log("LAYOUT: Setting up tour trigger listener...");

    const checkInterval = setInterval(() => {
      const shouldStartTour = localStorage.getItem("start_onboarding_tour");
      const tourActive = localStorage.getItem("onboarding_tour_active");

      // Don't start a new tour if one is already running
      if (tourActive === "true") {
        console.log("LAYOUT: Tour already active, setting runTour to true");
        setRunTour(true);
        clearInterval(checkInterval);
        return;
      }

      if (shouldStartTour === "true") {
        console.log("LAYOUT: Found start_onboarding_tour=true in localStorage!");
        localStorage.removeItem("start_onboarding_tour");

        // Navigate to main dashboard if not already there
        if (location.pathname !== "/dashboard") {
          console.log("LAYOUT: Not on /dashboard (currently on:", location.pathname, "), navigating...");
          navigate("/dashboard");

          // Wait for navigation then start tour
          setTimeout(() => {
            console.log("LAYOUT: After navigation, starting tour");
            setRunTour(true);
          }, 500);
        } else {
          // Already on dashboard, start tour after short delay
          console.log("LAYOUT: Already on /dashboard, starting tour after 500ms delay");
          setTimeout(() => {
            console.log("LAYOUT: Setting runTour to TRUE");
            setRunTour(true);
          }, 500);
        }

        clearInterval(checkInterval);
      }
    }, 500);

    return () => {
      console.log("LAYOUT: Cleaning up interval on unmount");
      clearInterval(checkInterval);
    };
  }, [location.pathname, navigate]);

  // Log when runTour changes
  useEffect(() => {
    console.log("LAYOUT: runTour state changed to:", runTour);
  }, [runTour]);

  return (
    <div className="min-h-screen flex flex-col">
      <OnboardingTour run={runTour} />
      <Navbar />

      <div className="flex-1 flex">
        {/* Sidebar */}
        <aside className="w-64 border-r border-border bg-muted/30 hidden md:block">
          <div className="sticky top-16 p-6 space-y-1">
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-1">Dashboard</h2>
              <p className="text-sm text-muted-foreground">
                Manage your account
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full mb-6 justify-start"
              onClick={() => {
                console.log("SIDEBAR: Start Tour button clicked!");
                resetOnboardingTour();
                console.log("SIDEBAR: Flag set, NOT reloading - relying on Dashboard to pick it up");
                // Dispatch custom event to notify Dashboard
                window.dispatchEvent(new CustomEvent('startTour'));
              }}
            >
              <Play className="w-4 h-4 mr-2" />
              Start Tour
            </Button>

            <nav className="space-y-1" data-tour="sidebar-nav">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;

                // Add data-tour attributes to specific nav items
                const getTourAttr = () => {
                  if (item.href === "/dashboard/parse") return "nav-parse";
                  if (item.href === "/dashboard/roles") return "nav-roles";
                  if (item.href === "/dashboard/candidates") return "nav-candidates";
                  if (item.href === "/dashboard/developer") return "nav-developer";
                  return undefined;
                };

                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    data-tour={getTourAttr()}
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
            <div className="px-4 pt-4 pb-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => {
                  console.log("MOBILE: Start Tour button clicked!");
                  resetOnboardingTour();
                  console.log("MOBILE: Flag set, NOT reloading - relying on Dashboard to pick it up");
                  // Dispatch custom event to notify Dashboard
                  window.dispatchEvent(new CustomEvent('startTour'));
                }}
              >
                <Play className="w-4 h-4 mr-2" />
                Start Tour
              </Button>
            </div>
            <nav className="flex gap-1 p-4 pt-2">
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
