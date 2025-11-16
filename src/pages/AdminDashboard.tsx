import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/contexts/UserContext";
import {
  ArrowLeft,
  TrendingUp,
  Users,
  MessageSquare,
  CheckCircle2,
  Clock,
  Sparkles,
  Loader2,
  XCircle,
  BarChart3,
  Shield,
} from "lucide-react";

interface FeatureRequest {
  id: string;
  title: string;
  description: string;
  upvotes: number;
  downvotes: number;
  status: string;
  created_at: string;
}

// Admin emails - should match FeatureRequests.tsx
const ADMIN_EMAILS = ["admin@qualifyr.ai", "your@email.com"];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: authLoading } = useUser();
  const [features, setFeatures] = useState<FeatureRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const isAdmin = user?.email && ADMIN_EMAILS.includes(user.email);

  // Redirect if not admin
  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !isAdmin)) {
      toast({
        title: "Access Denied",
        description: "You must be an admin to access this page",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [authLoading, isAuthenticated, isAdmin, navigate, toast]);

  // Fetch all feature requests
  const fetchFeatures = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("feature_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setFeatures(data || []);
    } catch (error) {
      console.error("Error fetching features:", error);
      toast({
        title: "Error",
        description: "Failed to load feature requests",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchFeatures();
    }
  }, [isAdmin]);

  // Handle status change
  const handleStatusChange = async (featureId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("feature_requests")
        .update({ status: newStatus })
        .eq("id", featureId);

      if (error) {
        console.error("Update error:", error);
        throw error;
      }

      toast({
        title: "Status Updated",
        description: `Feature request marked as ${newStatus.replace("_", " ")}`,
      });

      fetchFeatures();
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update status. Check RLS policies in Supabase.",
        variant: "destructive",
      });
    }
  };

  // Delete feature request
  const handleDelete = async (featureId: string) => {
    if (!confirm("Are you sure you want to delete this feature request?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("feature_requests")
        .delete()
        .eq("id", featureId);

      if (error) throw error;

      toast({
        title: "Deleted",
        description: "Feature request deleted successfully",
      });

      fetchFeatures();
    } catch (error) {
      console.error("Error deleting feature:", error);
      toast({
        title: "Error",
        description: "Failed to delete feature request",
        variant: "destructive",
      });
    }
  };

  // Calculate statistics
  const stats = {
    total: features.length,
    pending: features.filter((f) => f.status === "pending").length,
    under_review: features.filter((f) => f.status === "under_review").length,
    planned: features.filter((f) => f.status === "planned").length,
    in_progress: features.filter((f) => f.status === "in_progress").length,
    completed: features.filter((f) => f.status === "completed").length,
    declined: features.filter((f) => f.status === "declined").length,
    totalVotes: features.reduce((sum, f) => sum + f.upvotes + f.downvotes, 0),
    avgNetVotes: features.length > 0
      ? Math.round(features.reduce((sum, f) => sum + (f.upvotes - f.downvotes), 0) / features.length)
      : 0,
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-4 h-4" />;
      case "in_progress":
        return <Loader2 className="w-4 h-4" />;
      case "planned":
        return <Sparkles className="w-4 h-4" />;
      case "under_review":
        return <Clock className="w-4 h-4" />;
      case "declined":
        return <XCircle className="w-4 h-4" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-gray-500",
      under_review: "bg-blue-500",
      planned: "bg-purple-500",
      in_progress: "bg-yellow-500",
      completed: "bg-green-500",
      declined: "bg-red-500",
    };
    return colors[status] || "bg-gray-500";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="mb-4 gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>

          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
                <Shield className="w-10 h-10 text-primary" />
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground text-lg">
                Manage feature requests and view analytics
              </p>
            </div>
            <Button onClick={() => navigate("/feature-requests")} variant="outline">
              View Public Page
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Total Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Pending Review
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.pending}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Total Votes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalVotes}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Avg Net Votes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {stats.avgNetVotes > 0 ? "+" : ""}
                {stats.avgNetVotes}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status Breakdown */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Status Breakdown
            </CardTitle>
            <CardDescription>Distribution of feature requests by status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-500">{stats.pending}</div>
                <div className="text-sm text-muted-foreground">Pending</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">{stats.under_review}</div>
                <div className="text-sm text-muted-foreground">Under Review</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-500">{stats.planned}</div>
                <div className="text-sm text-muted-foreground">Planned</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-500">{stats.in_progress}</div>
                <div className="text-sm text-muted-foreground">In Progress</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">{stats.completed}</div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-500">{stats.declined}</div>
                <div className="text-sm text-muted-foreground">Declined</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feature Requests Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Feature Requests</CardTitle>
            <CardDescription>Manage and update feature request statuses</CardDescription>
          </CardHeader>
          <CardContent>
            {features.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No feature requests yet
              </div>
            ) : (
              <div className="space-y-4">
                {features.map((feature) => {
                  const netVotes = feature.upvotes - feature.downvotes;
                  return (
                    <div
                      key={feature.id}
                      className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">{feature.title}</h3>
                            <Badge className={`${getStatusColor(feature.status)} shrink-0 text-xs flex items-center gap-1`}>
                              {getStatusIcon(feature.status)}
                              {feature.status.replace("_", " ")}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {feature.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>{formatDate(feature.created_at)}</span>
                            <span>•</span>
                            <span className={netVotes > 0 ? "text-primary font-medium" : netVotes < 0 ? "text-destructive font-medium" : ""}>
                              {netVotes > 0 ? "+" : ""}{netVotes} net votes
                            </span>
                            <span>•</span>
                            <span>{feature.upvotes} up</span>
                            <span>•</span>
                            <span>{feature.downvotes} down</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Select
                            value={feature.status}
                            onValueChange={(value) => handleStatusChange(feature.id, value)}
                          >
                            <SelectTrigger className="w-40">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="under_review">Under Review</SelectItem>
                              <SelectItem value="planned">Planned</SelectItem>
                              <SelectItem value="in_progress">In Progress</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="declined">Declined</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(feature.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
