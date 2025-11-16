import { useEffect, useState } from "react";
import Joyride, { CallBackProps, STATUS, Step } from "react-joyride";

interface OnboardingTourProps {
  run?: boolean;
  onComplete?: () => void;
}

export const OnboardingTour = ({ run = true, onComplete }: OnboardingTourProps) => {
  const [runTour, setRunTour] = useState(false);

  useEffect(() => {
    // Check if user has completed the tour before
    const hasCompletedTour = localStorage.getItem("onboarding_tour_completed");
    console.log("Onboarding tour check:", { hasCompletedTour, run });
    if (!hasCompletedTour && run) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        console.log("Starting onboarding tour");
        setRunTour(true);
      }, 500);
    }
  }, [run]);

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
          <h3 className="font-semibold">Your API Statistics</h3>
          <p>Monitor your API usage, parses, scores, and response times at a glance.</p>
        </div>
      ),
      placement: "bottom",
    },
    {
      target: "[data-tour='api-keys-tab']",
      content: (
        <div className="space-y-2">
          <h3 className="font-semibold">API Keys</h3>
          <p>This is where you'll find and manage your API authentication keys.</p>
        </div>
      ),
      placement: "bottom",
    },
    {
      target: "[data-tour='api-key-section']",
      content: (
        <div className="space-y-2">
          <h3 className="font-semibold">Your Production Key</h3>
          <p>Click the eye icon to reveal your API key, or the copy icon to copy it to your clipboard.</p>
          <p className="text-sm text-yellow-600 dark:text-yellow-500">
            ⚠️ Keep this key secure and never share it publicly!
          </p>
        </div>
      ),
      placement: "top",
    },
    {
      target: "[data-tour='usage-tab']",
      content: (
        <div className="space-y-2">
          <h3 className="font-semibold">Usage & Analytics</h3>
          <p>Track your API usage, success rates, and performance metrics here.</p>
        </div>
      ),
      placement: "bottom",
    },
    {
      target: "[data-tour='documentation-link']",
      content: (
        <div className="space-y-2">
          <h3 className="font-semibold">Ready to Get Started?</h3>
          <p>Check out our documentation to learn how to integrate the API into your application.</p>
          <p className="text-sm font-medium text-primary">Happy coding! 🚀</p>
        </div>
      ),
      placement: "top",
    },
  ];

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;

    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      // Mark tour as completed
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

// Helper function to reset tour (for testing or re-showing)
export const resetOnboardingTour = () => {
  localStorage.removeItem("onboarding_tour_completed");
};
