import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "@/contexts/UserContext";
import { RolesProvider } from "@/contexts/RolesContext";
import { ScrollToTop } from "@/components/ScrollToTop";
import { FeedbackPopup } from "@/components/FeedbackPopup";
import { DevAccountSwitcher } from "@/components/DevAccountSwitcher";
import { useUser } from "@/contexts/UserContext";
import Index from "./pages/Index";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import Docs from "./pages/Docs";
import Auth from "./pages/Auth";
import Overview from "./pages/dashboard/Overview";
import ParseCV from "./pages/dashboard/ParseCV";
import BulkParse from "./pages/dashboard/BulkParse";
import DeveloperDashboard from "./pages/dashboard/DeveloperDashboard";
import OpenRoles from "./pages/dashboard/OpenRoles";
import RoleDetails from "./pages/dashboard/RoleDetails";
import AllCandidates from "./pages/dashboard/AllCandidates";
import CandidateDetail from "./pages/dashboard/CandidateDetail";
import Analytics from "./pages/Analytics";
import Billing from "./pages/Billing";
import Settings from "./pages/Settings";
import UpgradePlan from "./pages/UpgradePlan";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import FeatureRequests from "./pages/FeatureRequests";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const { setDevUser, user } = useUser();

  return (
    <>
      <Toaster />
      <Sonner />
      <FeedbackPopup />
      <DevAccountSwitcher
        onUserChange={(mockUser) => {
          if (mockUser) {
            setDevUser({
              firstName: mockUser.firstName,
              lastName: mockUser.lastName,
              email: mockUser.email,
              company: mockUser.company,
            });
          } else {
            setDevUser(null);
          }
        }}
        currentUserId={user?.email || null}
      />
      <BrowserRouter>
          <ScrollToTop />
          <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/features" element={<Features />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/docs" element={<Docs />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Overview />} />
          <Route path="/dashboard/parse" element={<ParseCV />} />
          <Route path="/dashboard/bulk-parse" element={<BulkParse />} />
          <Route path="/dashboard/developer" element={<DeveloperDashboard />} />
          <Route path="/dashboard/roles" element={<OpenRoles />} />
          <Route path="/dashboard/roles/:id" element={<RoleDetails />} />
          <Route path="/dashboard/candidates" element={<AllCandidates />} />
          <Route path="/dashboard/candidates/:candidateId/:roleId" element={<CandidateDetail />} />
          <Route path="/dashboard/analytics" element={<Analytics />} />
          <Route path="/dashboard/billing" element={<Billing />} />
          <Route path="/dashboard/settings" element={<Settings />} />
          <Route path="/upgrade" element={<UpgradePlan />} />
          {/* <Route path="/analytics" element={<Analytics />} /> */}
          <Route path="/billing" element={<Billing />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/feature-requests" element={<FeatureRequests />} />
          <Route path="/admin" element={<AdminDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <RolesProvider>
        <TooltipProvider>
          <AppContent />
        </TooltipProvider>
      </RolesProvider>
    </UserProvider>
  </QueryClientProvider>
);

export default App;
