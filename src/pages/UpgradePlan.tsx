import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
      "All file formats (PDF, DOCX, DOC, TXT)",
      "Baseline + AI scoring",
      "Priority email support",
      "99.9% uptime SLA",
      "Advanced analytics",
      "Custom skill taxonomies",
      "Webhook support",
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
      "99.95% uptime SLA",
      "Custom integrations",
      "On-premise deployment option",
      "SSO / SAML authentication",
      "Volume discounts",
      "Custom SLAs",
      "Training & onboarding",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

const UpgradePlan = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/developer')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Developer
          </Button>
        </div>

        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Upgrade Your Plan</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Unlock more features and capacity for your growing needs
          </p>
        </div>

        {/* Current Plan Info */}
        <Card className="max-w-3xl mx-auto bg-muted/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  Current Plan: <Badge variant="secondary">Starter (Free)</Badge>
                </CardTitle>
                <CardDescription className="mt-1">
                  1,000 parses/month • 500 scores/month
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Upgrade Plans */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {upgradePlans.map((plan, index) => (
            <Card
              key={index}
              className={`relative ${
                plan.popular
                  ? 'border-primary shadow-lg scale-105'
                  : 'border-border'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-accent text-accent-foreground">Most Popular</Badge>
                </div>
              )}

              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && (
                    <span className="text-muted-foreground ml-1">{plan.period}</span>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full mt-6"
                  variant={plan.popular ? "default" : "outline"}
                  size="lg"
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ or Additional Info */}
        <div className="max-w-3xl mx-auto mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Need help choosing? <a href="mailto:sales@parsescore.com" className="text-primary hover:underline">Contact our sales team</a>
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UpgradePlan;
