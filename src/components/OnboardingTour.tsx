import { useEffect, useState } from "react";
import Joyride, { CallBackProps, STATUS, Step } from "react-joyride";

interface OnboardingTourProps {
  run?: boolean;
  onComplete?: () => void;
}

export const OnboardingTour = ({ run = true, onComplete }: OnboardingTourProps) => {
  const [runTour, setRunTour] = useState(false);

  useEffect(() => {
    // Only start tour if explicitly requested via run prop
    if (run) {
      console.log("OnboardingTour: run prop is TRUE - waiting 2s for DOM to be ready");
      // Wait for DOM elements to be fully rendered
      setTimeout(() => {
        console.log("OnboardingTour: Starting tour NOW");
        setRunTour(true);
      }, 2000);
    } else {
      console.log("OnboardingTour: run prop is false - NOT running tour");
      setRunTour(false);
    }
  }, [run]);

  console.log("OnboardingTour render:", { runTour });

  const steps: Step[] = [
    {
      target: "body",
      content: (
        <div className="space-y-3">
          <h2 className="text-xl font-bold">Welcome to Qualifyr.AI! 🎉</h2>
          <p>Let's take a quick tour of the key features to help you get started.</p>
          <p className="text-sm text-muted-foreground">This tour will show you everything you need to know in about a minute.</p>
        </div>
      ),
      placement: "center",
      disableBeacon: true,
    },
    {
      target: "[data-tour='stats-overview']",
      content: (
        <div className="space-y-2">
          <h3 className="font-semibold">Your Dashboard Overview</h3>
          <p>Track your key metrics at a glance: CVs processed, candidates scored, top matches, and average processing times.</p>
        </div>
      ),
      placement: "bottom",
    },
    {
      target: "[data-tour='quick-actions']",
      content: (
        <div className="space-y-2">
          <h3 className="font-semibold">Quick Actions</h3>
          <p>Access your most common tasks with one click: upload CVs, score candidates, view all candidates, or download reports.</p>
        </div>
      ),
      placement: "left",
    },
    {
      target: "[data-tour='sidebar-nav']",
      content: (
        <div className="space-y-2">
          <h3 className="font-semibold">Navigation Sidebar</h3>
          <p>Use the sidebar to navigate between different sections of your dashboard. Let's explore some key features!</p>
        </div>
      ),
      placement: "right",
    },
    {
      target: "[data-tour='nav-parse']",
      content: (
        <div className="space-y-2">
          <h3 className="font-semibold">Parse CV</h3>
          <p>Upload individual CVs to extract structured data and automatically parse candidate information.</p>
        </div>
      ),
      placement: "right",
    },
    {
      target: "[data-tour='nav-roles']",
      content: (
        <div className="space-y-2">
          <h3 className="font-semibold">Open Roles</h3>
          <p>Create and manage your job openings, track applications, and organize candidates by position.</p>
        </div>
      ),
      placement: "right",
    },
    {
      target: "[data-tour='nav-candidates']",
      content: (
        <div className="space-y-2">
          <h3 className="font-semibold">Candidates</h3>
          <p>View all your candidates across all roles in one place. Sort by score, filter by status, and manage your talent pipeline.</p>
        </div>
      ),
      placement: "right",
    },
    {
      target: "[data-tour='nav-developer']",
      content: (
        <div className="space-y-2">
          <h3 className="font-semibold">Developer Dashboard</h3>
          <p>Access your API keys, view usage metrics, and explore our technical documentation for API integration.</p>
        </div>
      ),
      placement: "right",
    },
    {
      target: "body",
      content: (
        <div className="space-y-3">
          <h2 className="text-xl font-bold">You're All Set! 🚀</h2>
          <p>You now know the key features of Qualifyr.AI. Start by uploading a CV or creating your first open role.</p>
          <p className="text-sm text-muted-foreground">
            You can restart this tour anytime by clicking the "Start Tour" button in the sidebar.
          </p>
        </div>
      ),
      placement: "center",
    },
  ];

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, type } = data;
    console.log("Joyride callback:", { status, type, data });

    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      // Mark tour as completed
      console.log("Tour completed or skipped, saving to localStorage");
      localStorage.setItem("onboarding_tour_completed", "true");
      setRunTour(false);
      onComplete?.();
    }
  };

  return (
    <Joyride
      steps={steps}
      run={runTour}
      continuous
      showProgress
      showSkipButton
      callback={handleJoyrideCallback}
      disableScrolling={false}
      spotlightClicks={false}
      disableOverlayClose
      hideCloseButton={false}
      styles={{
        options: {
          primaryColor: "hsl(var(--primary))",
          zIndex: 10000,
        },
        tooltip: {
          borderRadius: 8,
          fontSize: 14,
        },
        buttonNext: {
          backgroundColor: "hsl(var(--primary))",
          borderRadius: 6,
          padding: "8px 16px",
        },
        buttonBack: {
          color: "hsl(var(--muted-foreground))",
        },
        buttonSkip: {
          color: "hsl(var(--muted-foreground))",
        },
      }}
      locale={{
        back: "Back",
        close: "Close",
        last: "Finish",
        next: "Next",
        skip: "Skip Tour",
      }}
    />
  );
};

// Helper function to reset tour and request it to start
export const resetOnboardingTour = () => {
  console.log("resetOnboardingTour: Removing onboarding_tour_completed from localStorage");
  localStorage.removeItem("onboarding_tour_completed");
  console.log("resetOnboardingTour: Setting start_onboarding_tour=true in localStorage");
  localStorage.setItem("start_onboarding_tour", "true");
  console.log("resetOnboardingTour: localStorage now has:", {
    completed: localStorage.getItem("onboarding_tour_completed"),
    start: localStorage.getItem("start_onboarding_tour")
  });
};
