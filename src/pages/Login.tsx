import { useState } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Zap } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  // Check URL params for default tab (e.g., /login?tab=signup)
  const defaultTab = searchParams.get('tab') || 'login';

  // Get return path and selected plan from navigation state
  const returnTo = location.state?.returnTo || '/app/dashboard';
  const selectedPlan = sessionStorage.getItem('selectedPlan');

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // TODO: Replace with actual authentication API call
    // For now, simulate login
    setTimeout(() => {
      // Simulate successful login
      toast.success('Welcome back!');

      // TEMP: Skip Stripe checkout and go directly to dashboard
      // Clear selected plan from session storage
      sessionStorage.removeItem('selectedPlan');

      // Go directly to the dashboard
      navigate('/app/dashboard');

      setIsLoading(false);
    }, 1000);
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const name = formData.get('name') as string;

    // TODO: Replace with actual signup API call
    // For now, simulate signup
    setTimeout(() => {
      toast.success('Account created successfully!');

      // TEMP: Skip Stripe checkout and go directly to dashboard
      // Clear selected plan from session storage
      sessionStorage.removeItem('selectedPlan');

      // Go directly to the dashboard
      navigate('/app/dashboard');

      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/5 to-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Zap className="h-6 w-6" />
          </div>
          <div>
            <CardTitle className="text-2xl">Welcome to Qualifyr.AI</CardTitle>
            <CardDescription>
              {selectedPlan
                ? `Sign in or create an account to continue with your ${JSON.parse(selectedPlan).name} plan`
                : 'Sign in to your account or create a new one'}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    name="password"
                    type="password"
                    required
                    disabled={isLoading}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
                <div className="text-center">
                  <Button variant="link" size="sm">
                    Forgot password?
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input
                    id="signup-name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    name="password"
                    type="password"
                    placeholder="Min. 8 characters"
                    required
                    disabled={isLoading}
                    minLength={8}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Creating account...' : 'Create Account'}
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  By signing up, you agree to our Terms of Service and Privacy Policy
                </p>
              </form>
            </TabsContent>
          </Tabs>

          {selectedPlan && (
            <div className="mt-6 rounded-lg bg-primary/5 p-4 text-sm">
              <p className="font-semibold">Selected Plan: {JSON.parse(selectedPlan).name}</p>
              <p className="text-muted-foreground">
                After signing in, you'll be redirected to the dashboard.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}