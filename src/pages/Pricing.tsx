import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    name: "Basic",
    price: "£29.99",
    period: "/month",
    description: "Perfect for small teams and startups",
    features: [
      "5,000 parses/month",
      "2,500 scores/month",
      "All file formats (PDF, DOCX, DOC, TXT)",
      "Baseline scoring",
      "Email support",
      "99.5% uptime SLA",
      "API documentation",
    ],
    cta: "Get Started",
    popular: false,
    stripePriceId: "price_basic_monthly", // TODO: Replace with actual Stripe Price ID
  },
  {
    name: "Pro",
    price: "£49.99",
    period: "/month",
    description: "For growing teams with higher volume",
    features: [
      "25,000 parses/month",
      "12,500 scores/month",
      "All file formats (PDF, DOCX, DOC, TXT)",
      "Baseline + AI scoring",
      "Priority email support",
      "99.9% uptime SLA",
      "Advanced analytics",
      "Custom skill taxonomies",
      "Webhook support",
    ],
    cta: "Get Started",
    popular: true,
    stripePriceId: "price_pro_monthly", // TODO: Replace with actual Stripe Price ID
  },
  {
    name: "Business",
    price: "£99.99",
    period: "/month",
    description: "For established teams at scale",
    features: [
      "100,000 parses/month",
      "50,000 scores/month",
      "All file formats + priority processing",
      "Full AI scoring with enhanced models",
      "Dedicated support (24/7)",
      "99.95% uptime SLA",
      "Advanced analytics & reporting",
      "Custom integrations",
      "Team management",
      "Volume discounts available",
    ],
    cta: "Get Started",
    popular: false,
    stripePriceId: "price_business_monthly", // TODO: Replace with actual Stripe Price ID
  },
];

const PricingPage = () => {
  const navigate = useNavigate();

  const handleGetStarted = (plan: typeof plans[0]) => {
    // Check if user is logged in
    // TODO: Replace with your actual auth check
    const isLoggedIn = false; // This should check your auth state

    if (!isLoggedIn) {
      // Store the selected plan in sessionStorage to retrieve after login
      sessionStorage.setItem('selectedPlan', JSON.stringify({
        name: plan.name,
        price: plan.price,
        stripePriceId: plan.stripePriceId
      }));

      // Redirect to login/signup page
      navigate('/login', { state: { returnTo: '/checkout', selectedPlan: plan.name } });
    } else {
      // User is logged in, go directly to Stripe checkout
      redirectToStripeCheckout(plan.stripePriceId);
    }
  };

  const redirectToStripeCheckout = (priceId: string) => {
    // TODO: This should call your backend to create a Stripe checkout session
    // For now, redirect to a placeholder
    const stripeCheckoutUrl = `https://checkout.stripe.com/c/pay/${priceId}`;

    // In production, you'd do something like:
    // const response = await fetch('/api/create-checkout-session', {
    //   method: 'POST',
    //   body: JSON.stringify({ priceId }),
    // });
    // const { url } = await response.json();
    // window.location.href = url;

    window.location.href = stripeCheckoutUrl;
  };

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
              Choose the plan that fits your needs. Upgrade or downgrade anytime.
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
                      onClick={() => handleGetStarted(plan)}
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

        {/* Comparison Table */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-12 text-center">
                Compare Plans
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-4 px-4">Feature</th>
                      <th className="text-center py-4 px-4">Basic</th>
                      <th className="text-center py-4 px-4">Pro</th>
                      <th className="text-center py-4 px-4">Business</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    <tr className="border-b">
                      <td className="py-4 px-4">Monthly parses</td>
                      <td className="text-center py-4 px-4">5,000</td>
                      <td className="text-center py-4 px-4">25,000</td>
                      <td className="text-center py-4 px-4">100,000</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-4 px-4">AI Scoring</td>
                      <td className="text-center py-4 px-4">-</td>
                      <td className="text-center py-4 px-4">✓</td>
                      <td className="text-center py-4 px-4">✓ Enhanced</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-4 px-4">Support</td>
                      <td className="text-center py-4 px-4">Email</td>
                      <td className="text-center py-4 px-4">Priority</td>
                      <td className="text-center py-4 px-4">24/7 Dedicated</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-4 px-4">Custom integrations</td>
                      <td className="text-center py-4 px-4">-</td>
                      <td className="text-center py-4 px-4">-</td>
                      <td className="text-center py-4 px-4">✓</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-12 text-center">
                Frequently Asked Questions
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2">What happens after I click "Get Started"?</h3>
                  <p className="text-muted-foreground">
                    You'll be asked to create an account (or login if you have one). After signing up, you'll be redirected to Stripe for secure payment. Once payment is complete, you'll immediately access the app to start scoring CVs.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-2">What counts as a "parse" or "score"?</h3>
                  <p className="text-muted-foreground">
                    A parse is one CV file processed through our parsing API. A score is one candidate-job comparison through our scoring API. Cached results don't count toward your limit.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-2">Can I upgrade or downgrade anytime?</h3>
                  <p className="text-muted-foreground">
                    Yes! You can change plans at any time from your account settings. Upgrades take effect immediately, downgrades at the end of your billing period.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-2">What's the difference between baseline and AI scoring?</h3>
                  <p className="text-muted-foreground">
                    Baseline scoring uses deterministic rules and weights (fast, reproducible). AI scoring adds LLM-powered rationale and contextual adjustments for deeper insights into candidate fit.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-2">Is my data secure and private?</h3>
                  <p className="text-muted-foreground">
                    Absolutely. We use TLS encryption, secure key hashing, and don't persist CVs by default. We're GDPR-compliant with regional storage options and PII minimization built-in.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-2">What payment methods do you accept?</h3>
                  <p className="text-muted-foreground">
                    We accept all major credit cards (Visa, Mastercard, American Express) and debit cards through our secure Stripe payment processor.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-b from-background to-primary/5">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join hundreds of companies using Qualifyr.AI to streamline their hiring process.
            </p>
            <Button
              variant="hero"
              size="lg"
              onClick={() => navigate('/pricing')}
            >
              View Plans
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default PricingPage;