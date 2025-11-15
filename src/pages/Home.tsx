import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { HowItWorks } from "@/components/HowItWorks";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote: "Qualifyr.AI transformed our hiring process. We're now screening candidates 10x faster and finding better matches than ever before.",
    author: "Sarah Chen",
    role: "Head of Talent, TechFlow Inc.",
  },
  {
    quote: "The AI scoring is incredibly accurate and saves our team hours every week. We've cut our time-to-hire in half since implementing Qualifyr.AI.",
    author: "Michael Rodriguez",
    role: "VP of HR, GrowthCorp",
  },
  {
    quote: "As a recruiter, Qualifyr.AI gives me superpowers. I can handle 3x more roles while actually improving the quality of candidates I present.",
    author: "Emily Watson",
    role: "Senior Recruiter, HireScale",
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
              Join hundreds of companies building better hiring experiences with Qualifyr.AI.
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

      <Footer />
    </div>
  );
};

export default HomePage;
