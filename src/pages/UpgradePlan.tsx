import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

// Exclude current plan (Starter/Free)
const upgradePlans = [
  {
    name: "Pro",
    price: "$99",
    period: "/month",
    description: "For growing teams and applications",
    features: [
      "50,000 parses/month",
      "25,000 scores/month",
      "All file formats",
      "Baseline + AI scoring",
      "Priority support",
      "Advanced analytics",
    ],
    cta: "Upgrade to Pro",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large-scale deployments",
    features: [
      "Unlimited parses & scores",
      "All Pro features",
      "Dedicated support",
      "Custom integrations",
      "On-premise option",
      "SSO / SAML auth",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

const UpgradePlan = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleUpgrade = async (planName: string) => {
    setIsLoading(true);
    try {
      // In production, this would redirect to Stripe Customer Portal
      const response = await fetch('/api/create-portal-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'upgrade', plan: planName }),
      });

      if (!response.ok) throw new Error('Failed to create portal session');

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      // Demo mode - show toast instead
      const isDev = import.meta.env.DEV || import.meta.env.MODE === 'development';
      if (isDev) {
        toast({
          title: "Demo Mode - Backend Required",
          description: `In production, this would redirect to Stripe Customer Portal to upgrade to ${planName}.`,
          duration: 5000,
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to redirect to billing portal. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold mb-2">Upgrade Your Plan</h1>
            <p className="text-muted-foreground">
              Currently on <Badge variant="secondary" className="mx-1">Starter (Free)</Badge> • 1,000 parses/month
            </p>
          </div>
        </div>

        {/* Upgrade Plans */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {upgradePlans.map((plan, index) => (
            <Card
              key={index}
              className={`relative ${
                plan.popular
                  ? 'border-primary shadow-lg'
                  : 'border-border'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-accent text-accent-foreground">Most Popular</Badge>
                </div>
              )}

              <CardHeader className="pb-4">
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription className="text-sm">{plan.description}</CardDescription>
                <div className="mt-3">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  {plan.period && (
                    <span className="text-muted-foreground text-sm ml-1">{plan.period}</span>
                  )}
                </div>
              </CardHeader>

              <CardContent>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-success flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full"
                  variant={plan.popular ? "default" : "outline"}
                  onClick={() => handleUpgrade(plan.name)}
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Questions? <a href="mailto:sales@parsescore.com" className="text-primary hover:underline">Contact sales</a>
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UpgradePlan;
