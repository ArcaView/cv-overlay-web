import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { HowItWorks } from "@/components/HowItWorks";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote: "ParseScore cut our CV processing time by 90%. The accuracy is incredible, and the API is a dream to integrate.",
    author: "Sarah Chen",
    role: "CTO, TalentFlow",
  },
  {
    quote: "Finally, an AI scoring system we can actually trust and explain to our clients. The transparency is game-changing.",
    author: "Michael Rodriguez",
    role: "Head of Product, RecruitTech",
  },
  {
    quote: "We evaluated five CV parsing APIs. ParseScore was the clear winner on accuracy, speed, and developer experience.",
    author: "Emily Watson",
    role: "Engineering Lead, HireScale",
  },
];

const HomePage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Features />
      
      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Trusted by Forward-Thinking Teams
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join hundreds of companies building better hiring experiences with ParseScore.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-border">
                <CardContent className="p-6">
                  <Quote className="w-8 h-8 text-primary mb-4" />
                  <p className="text-muted-foreground mb-6 italic">
                    "{testimonial.quote}"
                  </p>
                  <div>
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-primary/5 to-background" id="get-started">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Start Building Today
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Get started with our generous free tier. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg">
              Create Free Account
            </Button>
            <Button variant="outline" size="lg">
              Schedule Demo
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-6">
            1,000 free parses/month • No credit card required • Cancel anytime
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
