import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { ChevronUp, ChevronDown, Plus, MessageSquare } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface FeatureRequest {
  id: string;
  title: string;
  description: string;
  upvotes: number;
  downvotes: number;
  status: string;
  created_at: string;
  userVote?: "upvote" | "downvote" | null;
}

type SortBy = "newest" | "popular" | "controversial";
type FilterStatus = "all" | "pending" | "under_review" | "planned" | "in_progress" | "completed" | "declined";

const FeatureRequests = () => {
  const [features, setFeatures] = useState<FeatureRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sortBy, setSortBy] = useState<SortBy>("popular");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const [newFeature, setNewFeature] = useState({
    title: "",
    description: "",
  });

  // Get or create browser fingerprint for anonymous voting
  const getBrowserFingerprint = (): string => {
    let fingerprint = localStorage.getItem("browser_fingerprint");
    if (!fingerprint) {
      fingerprint = `fp_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      localStorage.setItem("browser_fingerprint", fingerprint);
    }
    return fingerprint;
  };

  // Fetch feature requests
  const fetchFeatures = async () => {
    setIsLoading(true);
    try {
      const fingerprint = getBrowserFingerprint();

      // Fetch feature requests
      let query = supabase
        .from("feature_requests")
        .select("*");

      // Apply status filter
      if (filterStatus !== "all") {
        query = query.eq("status", filterStatus);
      }

      const { data: featuresData, error: featuresError } = await query;

      if (featuresError) {
        console.error("Error fetching features:", featuresError);
        throw featuresError;
      }

      // Fetch user's votes
      const { data: votesData, error: votesError } = await supabase
        .from("feature_votes")
        .select("feature_id, vote_type")
        .eq("user_fingerprint", fingerprint);

      if (votesError) {
        console.error("Error fetching votes:", votesError);
      }

      const votesMap = new Map(
        votesData?.map((v) => [v.feature_id, v.vote_type as "upvote" | "downvote"]) || []
      );

      // Combine features with user votes
      const featuresWithVotes = (featuresData || []).map((feature) => ({
        ...feature,
        userVote: votesMap.get(feature.id) || null,
      }));

      // Sort features
      let sortedFeatures = [...featuresWithVotes];
      if (sortBy === "newest") {
        sortedFeatures.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      } else if (sortBy === "popular") {
        sortedFeatures.sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes));
      } else if (sortBy === "controversial") {
        sortedFeatures.sort((a, b) => {
          const aTotal = a.upvotes + a.downvotes;
          const bTotal = b.upvotes + b.downvotes;
          const aRatio = aTotal > 0 ? Math.min(a.upvotes, a.downvotes) / aTotal : 0;
          const bRatio = bTotal > 0 ? Math.min(b.upvotes, b.downvotes) / bTotal : 0;
          return bRatio - aRatio;
        });
      }

      setFeatures(sortedFeatures);
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
    fetchFeatures();
  }, [sortBy, filterStatus]);

  // Submit new feature request
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFeature.title.trim() || !newFeature.description.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("feature_requests").insert({
        title: newFeature.title.trim(),
        description: newFeature.description.trim(),
        status: "pending",
      });

      if (error) {
        console.error("Insert error:", error);
        throw error;
      }

      toast({
        title: "Success!",
        description: "Your feature request has been submitted",
      });

      setNewFeature({ title: "", description: "" });
      setIsDialogOpen(false);

      // Wait a moment then refresh
      setTimeout(() => {
        fetchFeatures();
      }, 500);
    } catch (error) {
      console.error("Error submitting feature:", error);
      toast({
        title: "Error",
        description: "Failed to submit feature request",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle voting
  const handleVote = async (featureId: string, voteType: "upvote" | "downvote") => {
    const fingerprint = getBrowserFingerprint();
    const feature = features.find((f) => f.id === featureId);
    if (!feature) return;

    const currentVote = feature.userVote;

    // Optimistically update UI immediately
    setFeatures((prev) =>
      prev.map((f) => {
        if (f.id !== featureId) return f;

        let newUpvotes = f.upvotes;
        let newDownvotes = f.downvotes;
        let newUserVote: "upvote" | "downvote" | null = null;

        // Calculate new vote counts
        if (currentVote === voteType) {
          // Removing vote
          if (voteType === "upvote") newUpvotes--;
          else newDownvotes--;
          newUserVote = null;
        } else if (currentVote) {
          // Changing vote
          if (currentVote === "upvote") newUpvotes--;
          else newDownvotes--;
          if (voteType === "upvote") newUpvotes++;
          else newDownvotes++;
          newUserVote = voteType;
        } else {
          // Adding new vote
          if (voteType === "upvote") newUpvotes++;
          else newDownvotes++;
          newUserVote = voteType;
        }

        return {
          ...f,
          upvotes: Math.max(0, newUpvotes),
          downvotes: Math.max(0, newDownvotes),
          userVote: newUserVote,
        };
      })
    );

    // Update database in background
    try {
      if (currentVote === voteType) {
        // Remove vote
        await supabase
          .from("feature_votes")
          .delete()
          .eq("feature_id", featureId)
          .eq("user_fingerprint", fingerprint);
      } else if (currentVote) {
        // Update existing vote
        await supabase
          .from("feature_votes")
          .update({ vote_type: voteType })
          .eq("feature_id", featureId)
          .eq("user_fingerprint", fingerprint);
      } else {
        // Create new vote
        await supabase.from("feature_votes").insert({
          feature_id: featureId,
          user_fingerprint: fingerprint,
          vote_type: voteType,
        });
      }
    } catch (error) {
      console.error("Error voting:", error);
      // Revert on error
      fetchFeatures();
      toast({
        title: "Error",
        description: "Failed to register vote",
        variant: "destructive",
      });
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

  const getStatusLabel = (status: string) => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Feature Requests</h1>
              <p className="text-muted-foreground">
                Vote on ideas and share your own suggestions
              </p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  New Request
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Submit a Feature Request</DialogTitle>
                  <DialogDescription>
                    Share your idea for a new feature or improvement
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      placeholder="Brief, descriptive title"
                      value={newFeature.title}
                      onChange={(e) => setNewFeature({ ...newFeature, title: e.target.value })}
                      maxLength={100}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your feature request in detail..."
                      value={newFeature.description}
                      onChange={(e) => setNewFeature({ ...newFeature, description: e.target.value })}
                      rows={5}
                      maxLength={1000}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      {newFeature.description.length}/1000
                    </p>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Submitting..." : "Submit"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Filters and Sorting */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortBy)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="controversial">Controversial</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as FilterStatus)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="planned">Planned</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="declined">Declined</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Feature Requests List */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        ) : features.length === 0 ? (
          <div className="text-center py-12 border border-dashed rounded-lg">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">
              No feature requests yet. Be the first!
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {features.map((feature) => {
              const netVotes = feature.upvotes - feature.downvotes;
              return (
                <div
                  key={feature.id}
                  className="flex gap-3 p-4 bg-card border border-border rounded-lg hover:bg-accent/5 transition-colors"
                >
                  {/* Voting Column */}
                  <div className="flex flex-col items-center gap-1 min-w-[48px]">
                    <button
                      onClick={() => handleVote(feature.id, "upvote")}
                      className={`p-1 rounded hover:bg-accent transition-colors ${
                        feature.userVote === "upvote"
                          ? "text-primary"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                      aria-label="Upvote"
                    >
                      <ChevronUp className="w-6 h-6" strokeWidth={feature.userVote === "upvote" ? 3 : 2} />
                    </button>
                    <span
                      className={`text-sm font-semibold tabular-nums ${
                        netVotes > 0
                          ? "text-primary"
                          : netVotes < 0
                          ? "text-destructive"
                          : "text-muted-foreground"
                      }`}
                    >
                      {netVotes > 0 ? "+" : ""}
                      {netVotes}
                    </span>
                    <button
                      onClick={() => handleVote(feature.id, "downvote")}
                      className={`p-1 rounded hover:bg-accent transition-colors ${
                        feature.userVote === "downvote"
                          ? "text-destructive"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                      aria-label="Downvote"
                    >
                      <ChevronDown className="w-6 h-6" strokeWidth={feature.userVote === "downvote" ? 3 : 2} />
                    </button>
                  </div>

                  {/* Content Column */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 mb-2">
                      <h3 className="text-lg font-semibold leading-tight">
                        {feature.title}
                      </h3>
                      <Badge className={`${getStatusColor(feature.status)} shrink-0 text-xs`}>
                        {getStatusLabel(feature.status)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2 whitespace-pre-wrap line-clamp-3">
                      {feature.description}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{formatDate(feature.created_at)}</span>
                      <span>•</span>
                      <span>{feature.upvotes} up</span>
                      <span>•</span>
                      <span>{feature.downvotes} down</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeatureRequests;
