import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { ThumbsUp, ThumbsDown, Plus, MessageSquare } from "lucide-react";
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

      if (featuresError) throw featuresError;

      // Fetch user's votes
      const { data: votesData } = await supabase
        .from("feature_votes")
        .select("feature_id, vote_type")
        .eq("user_fingerprint", fingerprint);

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

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your feature request has been submitted",
      });

      setNewFeature({ title: "", description: "" });
      setIsDialogOpen(false);
      fetchFeatures();
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
    const currentVote = feature?.userVote;

    try {
      if (currentVote === voteType) {
        // Remove vote if clicking the same button
        const { error } = await supabase
          .from("feature_votes")
          .delete()
          .eq("feature_id", featureId)
          .eq("user_fingerprint", fingerprint);

        if (error) throw error;
      } else if (currentVote) {
        // Update existing vote
        const { error } = await supabase
          .from("feature_votes")
          .update({ vote_type: voteType })
          .eq("feature_id", featureId)
          .eq("user_fingerprint", fingerprint);

        if (error) throw error;
      } else {
        // Create new vote
        const { error } = await supabase.from("feature_votes").insert({
          feature_id: featureId,
          user_fingerprint: fingerprint,
          vote_type: voteType,
        });

        if (error) throw error;
      }

      fetchFeatures();
    } catch (error) {
      console.error("Error voting:", error);
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-primary/5 to-background">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Feature Requests</h1>
          <p className="text-muted-foreground text-lg mb-8">
            Share your ideas and vote on features you'd like to see in Qualifyr.AI
          </p>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="gap-2">
                <Plus className="w-5 h-5" />
                Submit Feature Request
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
                    placeholder="Brief title for your feature request"
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
                    {newFeature.description.length}/1000 characters
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
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <Label htmlFor="sort" className="mb-2 block text-sm">Sort By</Label>
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortBy)}>
              <SelectTrigger id="sort">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="controversial">Most Controversial</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <Label htmlFor="filter" className="mb-2 block text-sm">Filter Status</Label>
            <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as FilterStatus)}>
              <SelectTrigger id="filter">
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

        {/* Feature Requests List */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading feature requests...</p>
          </div>
        ) : features.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                No feature requests yet. Be the first to submit one!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {features.map((feature) => (
              <Card key={feature.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-xl">{feature.title}</CardTitle>
                        <Badge className={getStatusColor(feature.status)}>
                          {getStatusLabel(feature.status)}
                        </Badge>
                      </div>
                      <CardDescription className="text-sm">
                        {new Date(feature.created_at).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground mb-4 whitespace-pre-wrap">{feature.description}</p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant={feature.userVote === "upvote" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleVote(feature.id, "upvote")}
                      className="gap-1"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      {feature.upvotes}
                    </Button>
                    <Button
                      variant={feature.userVote === "downvote" ? "destructive" : "outline"}
                      size="sm"
                      onClick={() => handleVote(feature.id, "downvote")}
                      className="gap-1"
                    >
                      <ThumbsDown className="w-4 h-4" />
                      {feature.downvotes}
                    </Button>
                    <span className="text-sm text-muted-foreground ml-2">
                      {feature.upvotes - feature.downvotes > 0 ? "+" : ""}
                      {feature.upvotes - feature.downvotes} net votes
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeatureRequests;
