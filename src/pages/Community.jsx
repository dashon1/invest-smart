import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { CommunityPost } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Users, 
  Plus, 
  Heart,
  MessageCircle,
  TrendingUp,
  Lightbulb,
  HelpCircle,
  Trophy,
  Share2
} from "lucide-react";

const postTypeIcons = {
  insight: Lightbulb,
  question: HelpCircle,
  achievement: Trophy,
  tip: TrendingUp,
  discussion: MessageCircle
};

const postTypeColors = {
  insight: "bg-purple-100 text-purple-800",
  question: "bg-blue-100 text-blue-800",
  achievement: "bg-amber-100 text-amber-800",
  tip: "bg-green-100 text-green-800",
  discussion: "bg-slate-100 text-slate-800"
};

export default function Community() {
  const [posts, setPosts] = useState([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [formData, setFormData] = useState({
    content: "",
    post_type: "discussion",
    tags: "",
    related_stock: ""
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [postsData, user] = await Promise.all([
        CommunityPost.list('-created_date', 50),
        base44.auth.me().catch(() => null)
      ]);
      setPosts(postsData);
      setCurrentUser(user);
    } catch (error) {
      console.error("Error loading community data:", error);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      await CommunityPost.create({
        content: formData.content,
        post_type: formData.post_type,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [],
        related_stock: formData.related_stock || null
      });

      setFormData({
        content: "",
        post_type: "discussion",
        tags: "",
        related_stock: ""
      });
      setShowCreateDialog(false);
      await loadData();
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handleLike = async (post) => {
    if (!currentUser) return;

    try {
      const userEmail = currentUser.email;
      const hasLiked = post.liked_by?.includes(userEmail);

      if (hasLiked) {
        await CommunityPost.update(post.id, {
          likes: Math.max(0, post.likes - 1),
          liked_by: post.liked_by.filter(email => email !== userEmail)
        });
      } else {
        await CommunityPost.update(post.id, {
          likes: post.likes + 1,
          liked_by: [...(post.liked_by || []), userEmail]
        });
      }

      await loadData();
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const filteredPosts = posts.filter(post => {
    if (selectedFilter === "all") return true;
    return post.post_type === selectedFilter;
  });

  return (
    <div className="p-4 md:p-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
              👥 Investor Community
            </h1>
            <p className="text-slate-600 text-lg">
              Learn, share insights, and grow together
            </p>
          </div>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                <Plus className="w-4 h-4 mr-2" />
                Create Post
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Share with the Community</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreatePost} className="space-y-4">
                <div>
                  <Select
                    value={formData.post_type}
                    onValueChange={(value) => setFormData({...formData, post_type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="insight">💡 Share an Insight</SelectItem>
                      <SelectItem value="question">❓ Ask a Question</SelectItem>
                      <SelectItem value="achievement">🏆 Share Achievement</SelectItem>
                      <SelectItem value="tip">💰 Investment Tip</SelectItem>
                      <SelectItem value="discussion">💬 Start Discussion</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Textarea
                    placeholder="What's on your mind?"
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    className="min-h-[120px]"
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">Post</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <Tabs value={selectedFilter} onValueChange={setSelectedFilter}>
              <TabsList className="w-full grid grid-cols-6 h-auto">
                <TabsTrigger value="all" className="text-xs md:text-sm">All</TabsTrigger>
                <TabsTrigger value="insight" className="text-xs md:text-sm">💡 Insights</TabsTrigger>
                <TabsTrigger value="question" className="text-xs md:text-sm">❓ Questions</TabsTrigger>
                <TabsTrigger value="achievement" className="text-xs md:text-sm">🏆 Wins</TabsTrigger>
                <TabsTrigger value="tip" className="text-xs md:text-sm">💰 Tips</TabsTrigger>
                <TabsTrigger value="discussion" className="text-xs md:text-sm">💬 Discuss</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        {/* Posts Feed */}
        <div className="space-y-4">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post, idx) => {
              const Icon = postTypeIcons[post.post_type] || MessageCircle;
              const hasLiked = currentUser && post.liked_by?.includes(currentUser.email);

              return (
                <Card key={idx} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">
                            {post.created_by?.split('@')[0] || 'Investor'}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={postTypeColors[post.post_type]}>
                              <Icon className="w-3 h-3 mr-1" />
                              {post.post_type}
                            </Badge>
                            {post.related_stock && (
                              <Badge variant="outline">{post.related_stock}</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-700 leading-relaxed mb-4 whitespace-pre-wrap">
                      {post.content}
                    </p>

                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map((tag, tagIdx) => (
                          <Badge key={tagIdx} variant="secondary" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-4 pt-4 border-t">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLike(post)}
                        className={hasLiked ? 'text-red-500' : ''}
                      >
                        <Heart className={`w-4 h-4 mr-2 ${hasLiked ? 'fill-current' : ''}`} />
                        {post.likes || 0}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        {post.comments_count || 0}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <Card>
              <CardContent className="text-center py-16">
                <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-slate-900 mb-2">No Posts Yet</h3>
                <p className="text-slate-500 mb-6">
                  Be the first to start a conversation in the community!
                </p>
                <Button onClick={() => setShowCreateDialog(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Post
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}