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
          <p>Let's take a quick tour to help you get started with your dashboard.</p>
          <p className="text-sm text-muted-foreground">This will only take 30 seconds.</p>
        </div>
      ),
      placement: "center",
      disableBeacon: true,
    },
    {
      target: "[data-tour='stats-overview']",
      content: (
        <div className="space-y-2">
          <h3 className="font-semibold">Your Key Metrics</h3>
          <p>Monitor CVs processed, candidates scored, top matches, and processing times at a glance.</p>
        </div>
      ),
      placement: "bottom",
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
