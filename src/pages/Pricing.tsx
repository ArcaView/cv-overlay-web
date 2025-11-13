import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "Free",
    description: "Perfect for testing and small projects",
    features: [
      "1,000 parses/month",
      "500 scores/month",
      "PDF & DOCX support",
      "Baseline scoring",
      "Email support",
      "99.5% uptime SLA",
      "Community access",
    ],
    cta: "Get Started",
    popular: false,
  },
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
    cta: "Start Pro Trial",
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

const PricingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-4 text-center">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Pricing</Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Start for free. Scale as you grow. No hidden fees or surprises.
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {plans.map((plan, index) => (
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
                    <CardDescription className="text-base">{plan.description}</CardDescription>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      {plan.period && (
                        <span className="text-muted-foreground">{plan.period}</span>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <Button 
                      variant={plan.popular ? "hero" : "default"}
                      className="w-full"
                      size="lg"
                    >
                      {plan.cta}
                    </Button>
                    
                    <ul className="space-y-3 pt-4">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-12 text-center">
                Frequently Asked Questions
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2">What counts as a "parse" or "score"?</h3>
                  <p className="text-muted-foreground">
                    A parse is one CV file processed through our parsing API. A score is one candidate-job comparison through our scoring API. Cached results don't count toward your limit.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-2">Can I upgrade or downgrade anytime?</h3>
                  <p className="text-muted-foreground">
                    Yes! You can change plans at any time. Upgrades take effect immediately, downgrades at the end of your billing period.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-2">What's the difference between baseline and AI scoring?</h3>
                  <p className="text-muted-foreground">
                    Baseline scoring uses deterministic rules and weights (fast, reproducible). AI scoring adds LLM-powered rationale and contextual adjustments (±10 points) for deeper insights.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-2">Do you offer volume discounts?</h3>
                  <p className="text-muted-foreground">
                    Yes! Enterprise plans include custom pricing based on volume. Contact our sales team for a quote tailored to your needs.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-2">Is my data secure and private?</h3>
                  <p className="text-muted-foreground">
                    Absolutely. We use TLS encryption, secure key hashing, and don't persist CVs by default. We're GDPR-compliant with regional storage options and PII minimization built-in.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Still Have Questions?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Our team is here to help you find the right plan for your needs.
            </p>
            <Button variant="outline" size="lg">
              Contact Sales
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default PricingPage;
