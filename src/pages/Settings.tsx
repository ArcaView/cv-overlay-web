import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Key, Shield, Eye, EyeOff, Copy } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
}

const Settings = () => {
  const { toast } = useToast();
  const { user, updateProfile } = useUser();

  // API Keys state
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(() => {
    const stored = localStorage.getItem("qualifyr_api_keys");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return [
          {
            id: "prod-1",
            name: "Production API Key",
            key: "ps_live_1234567890abcdef1234567890abcdef",
            createdAt: new Date().toISOString(),
          },
          {
            id: "test-1",
            name: "Test API Key",
            key: "ps_test_9876543210fedcba9876543210fedcba",
            createdAt: new Date().toISOString(),
          },
        ];
      }
    }
    return [
      {
        id: "prod-1",
        name: "Production API Key",
        key: "ps_live_1234567890abcdef1234567890abcdef",
        createdAt: new Date().toISOString(),
      },
      {
        id: "test-1",
        name: "Test API Key",
        key: "ps_test_9876543210fedcba9876543210fedcba",
        createdAt: new Date().toISOString(),
      },
    ];
  });

  const [revealedKeys, setRevealedKeys] = useState<Set<string>>(new Set());
  const [isGeneratingKey, setIsGeneratingKey] = useState(false);

  // Save API keys to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("qualifyr_api_keys", JSON.stringify(apiKeys));
  }, [apiKeys]);

  // Profile state - initialize from user context
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
  });

  // Load user data when component mounts or user changes
  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        company: user.company,
      });
    }
  }, [user]);

  const [isProfileLoading, setIsProfileLoading] = useState(false);

  const handleProfileChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProfileLoading(true);

    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update user profile in context
      updateProfile(profileData);

      toast({
        title: "Profile updated",
        description: "Your profile information has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProfileLoading(false);
    }
  };

  // API Key functions
  const toggleRevealKey = (keyId: string) => {
    setRevealedKeys(prev => {
      const newSet = new Set(prev);
      if (newSet.has(keyId)) {
        newSet.delete(keyId);
      } else {
        newSet.add(keyId);
      }
      return newSet;
    });
  };

  const copyToClipboard = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${keyName} copied to clipboard`,
    });
  };

  const generateNewApiKey = async () => {
    setIsGeneratingKey(true);

    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Generate a random API key
      const randomKey = `ps_live_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;

      const newKey: ApiKey = {
        id: `key-${Date.now()}`,
        name: `API Key ${apiKeys.length + 1}`,
        key: randomKey,
        createdAt: new Date().toISOString(),
      };

      setApiKeys(prev => [...prev, newKey]);
      setRevealedKeys(new Set([newKey.id])); // Auto-reveal the new key

      toast({
        title: "API Key Generated",
        description: "Your new API key has been created. Make sure to copy it now as it won't be shown again.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate API key. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingKey(false);
    }
  };

  const maskApiKey = (key: string) => {
    const prefix = key.substring(0, 8);
    return `${prefix}••••••••••••••••`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:w-auto">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger value="api" className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                <span className="hidden sm:inline">API Keys</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">Security</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your account profile information and email address
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          placeholder="John"
                          value={profileData.firstName}
                          onChange={(e) => handleProfileChange('firstName', e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          placeholder="Doe"
                          value={profileData.lastName}
                          onChange={(e) => handleProfileChange('lastName', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={profileData.email}
                        onChange={(e) => handleProfileChange('email', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        placeholder="Acme Inc."
                        value={profileData.company}
                        onChange={(e) => handleProfileChange('company', e.target.value)}
                      />
                    </div>
                    <Button type="submit" disabled={isProfileLoading}>
                      {isProfileLoading ? "Saving..." : "Save Changes"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="api" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>API Keys</CardTitle>
                  <CardDescription>
                    Manage your API keys for accessing the Qualifyr.AI API
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    {apiKeys.map((apiKey) => {
                      const isRevealed = revealedKeys.has(apiKey.id);
                      return (
                        <div key={apiKey.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1 min-w-0 mr-4">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-semibold">{apiKey.name}</p>
                              <span className="text-xs text-muted-foreground">
                                Created {formatDate(apiKey.createdAt)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <p className="text-sm text-muted-foreground font-mono truncate">
                                {isRevealed ? apiKey.key : maskApiKey(apiKey.key)}
                              </p>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => copyToClipboard(apiKey.key, apiKey.name)}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleRevealKey(apiKey.id)}
                          >
                            {isRevealed ? (
                              <>
                                <EyeOff className="h-4 w-4 mr-2" />
                                Hide
                              </>
                            ) : (
                              <>
                                <Eye className="h-4 w-4 mr-2" />
                                Reveal
                              </>
                            )}
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                  <Separator />
                  <Button
                    variant="outline"
                    onClick={generateNewApiKey}
                    disabled={isGeneratingKey}
                  >
                    {isGeneratingKey ? "Generating..." : "Generate New API Key"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>
                    Manage your password and security preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input id="confirmPassword" type="password" />
                  </div>
                  <Button>Update Password</Button>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Button variant="outline">Enable</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
