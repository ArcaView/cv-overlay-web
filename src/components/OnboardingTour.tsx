import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Joyride, { CallBackProps, STATUS, Step, ACTIONS, EVENTS } from "react-joyride";

interface OnboardingTourProps {
  run?: boolean;
  onComplete?: () => void;
}

export const OnboardingTour = ({ run = true, onComplete }: OnboardingTourProps) => {
  const navigate = useNavigate();
  const [runTour, setRunTour] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    // Only start tour if explicitly requested via run prop
    if (run) {
      console.log("OnboardingTour: run prop is TRUE - waiting 800ms for DOM to be ready");
      // Reset to first step
      setStepIndex(0);
      // Wait for DOM elements to be fully rendered
      setTimeout(() => {
        console.log("OnboardingTour: Starting tour NOW");
        setRunTour(true);
      }, 800);
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
          <p>Let's take a quick tour of the key features. We'll visit different sections to show you everything!</p>
          <p className="text-sm text-muted-foreground">This tour will take about a minute.</p>
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
          <p>Track your key metrics at a glance: CVs processed, candidates scored, top matches, and processing times.</p>
        </div>
      ),
      placement: "bottom",
    },
    {
      target: "[data-tour='quick-actions']",
      content: (
        <div className="space-y-2">
          <h3 className="font-semibold">Quick Actions</h3>
          <p>Access common tasks with one click. Now let's explore each section in detail!</p>
        </div>
      ),
      placement: "left",
    },
    {
      target: "[data-tour='upload-cv']",
      content: (
        <div className="space-y-2">
          <h3 className="font-semibold">Parse CV</h3>
          <p>Upload individual CVs to extract structured data. Supports PDF, DOCX, DOC, and TXT formats up to 10MB.</p>
        </div>
      ),
      placement: "bottom",
    },
    {
      target: "[data-tour='create-role']",
      content: (
        <div className="space-y-2">
          <h3 className="font-semibold">Create Open Roles</h3>
          <p>Click here to create job openings. Track applications and organize candidates by position.</p>
        </div>
      ),
      placement: "bottom",
    },
    {
      target: "[data-tour='candidates-list']",
      content: (
        <div className="space-y-2">
          <h3 className="font-semibold">All Candidates</h3>
          <p>View all candidates across roles. Sort by score, filter by status, and manage your talent pipeline.</p>
        </div>
      ),
      placement: "top",
    },
    {
      target: "[data-tour='api-keys']",
      content: (
        <div className="space-y-2">
          <h3 className="font-semibold">Developer API Keys</h3>
          <p>Manage your API authentication keys for programmatic access to Qualifyr.AI.</p>
        </div>
      ),
      placement: "bottom",
    },
    {
      target: "[data-tour='analytics-metrics']",
      content: (
        <div className="space-y-2">
          <h3 className="font-semibold">Analytics & Insights</h3>
          <p>Monitor recruitment metrics, API performance, and track your hiring progress over time.</p>
        </div>
      ),
      placement: "bottom",
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
    const { status, type, action, index } = data;
    console.log("Joyride callback:", { status, type, action, index });

    // Only handle STEP_AFTER events for navigation (when user clicks Next/Back)
    if (type === EVENTS.STEP_AFTER && (action === ACTIONS.NEXT || action === ACTIONS.PREV)) {
      const nextIndex = index + (action === ACTIONS.PREV ? -1 : 1);
      console.log("Step after, moving to index:", nextIndex);

      // Pause the tour and navigate to the appropriate page
      setRunTour(false);

      // Navigate based on next step
      if (nextIndex === 3) {
        // Step 3: Parse CV page
        console.log("Navigating to /dashboard/parse");
        navigate("/dashboard/parse");
        setTimeout(() => {
          setStepIndex(nextIndex);
          setRunTour(true);
        }, 800);
      } else if (nextIndex === 4) {
        // Step 4: Open Roles page
        console.log("Navigating to /dashboard/roles");
        navigate("/dashboard/roles");
        setTimeout(() => {
          setStepIndex(nextIndex);
          setRunTour(true);
        }, 800);
      } else if (nextIndex === 5) {
        // Step 5: Candidates page
        console.log("Navigating to /dashboard/candidates");
        navigate("/dashboard/candidates");
        setTimeout(() => {
          setStepIndex(nextIndex);
          setRunTour(true);
        }, 800);
      } else if (nextIndex === 6) {
        // Step 6: Developer page
        console.log("Navigating to /dashboard/developer");
        navigate("/dashboard/developer");
        setTimeout(() => {
          setStepIndex(nextIndex);
          setRunTour(true);
        }, 800);
      } else if (nextIndex === 7) {
        // Step 7: Analytics page
        console.log("Navigating to /dashboard/analytics");
        navigate("/dashboard/analytics");
        setTimeout(() => {
          setStepIndex(nextIndex);
          setRunTour(true);
        }, 800);
      } else if (nextIndex === 8) {
        // Step 8: Back to Overview for completion
        console.log("Navigating back to /dashboard");
        navigate("/dashboard");
        setTimeout(() => {
          setStepIndex(nextIndex);
          setRunTour(true);
        }, 800);
      } else if (nextIndex === 2 && action === ACTIONS.PREV) {
        // Going back to Overview from Parse CV
        console.log("Navigating back to /dashboard");
        navigate("/dashboard");
        setTimeout(() => {
          setStepIndex(nextIndex);
          setRunTour(true);
        }, 800);
      } else {
        // No navigation needed, just update step index
        setStepIndex(nextIndex);
        setRunTour(true);
      }
    }

    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      // Mark tour as completed
      console.log("Tour completed or skipped, saving to localStorage");
      localStorage.setItem("onboarding_tour_completed", "true");
      setRunTour(false);
      setStepIndex(0);
      // Navigate back to dashboard
      navigate("/dashboard");
      onComplete?.();
    }
  };

  return (
    <Joyride
      steps={steps}
      run={runTour}
      stepIndex={stepIndex}
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
