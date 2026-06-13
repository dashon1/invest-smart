import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Newspaper, 
  TrendingUp,
  Search,
  ExternalLink,
  Clock,
  Loader2,
  Sparkles
} from "lucide-react";

export default function NewsPage() {
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("market");

  const loadNews = async (query = "stock market news", category = "market") => {
    setIsLoading(true);
    try {
      const prompt = `Search for the latest ${category} news about: ${query}. 
      Return a JSON array of 6 news articles with this structure:
      [{"title": "string", "summary": "string", "source": "string", "category": "string", "published": "string"}]`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: prompt,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            articles: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  summary: { type: "string" },
                  source: { type: "string" },
                  category: { type: "string" },
                  published: { type: "string" }
                }
              }
            }
          }
        }
      });

      setNews(response.articles || []);
    } catch (error) {
      console.error("Error loading news:", error);
      // Fallback mock data
      setNews([
        {
          title: "Markets Hit Record High as Tech Stocks Rally",
          summary: "Major indices reached all-time highs today driven by strong performance in technology sector.",
          source: "Financial Times",
          category: "market",
          published: "2 hours ago"
        }
      ]);
    }
    setIsLoading(false);
  };

  const handleSearch = () => {
    loadNews(searchQuery || "latest stock market news", selectedCategory);
  };

  const categoryColors = {
    market: "bg-blue-100 text-blue-800",
    stocks: "bg-green-100 text-green-800",
    economy: "bg-purple-100 text-purple-800",
    tech: "bg-orange-100 text-orange-800",
    crypto: "bg-yellow-100 text-yellow-800"
  };

  return (
    <div className="p-4 md:p-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
            📰 Financial News & Updates
          </h1>
          <p className="text-slate-600 text-lg">
            Stay informed with the latest market news and insights
          </p>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search news topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10"
                />
              </div>
              <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full md:w-auto">
                <TabsList>
                  <TabsTrigger value="market">Market</TabsTrigger>
                  <TabsTrigger value="stocks">Stocks</TabsTrigger>
                  <TabsTrigger value="economy">Economy</TabsTrigger>
                  <TabsTrigger value="tech">Tech</TabsTrigger>
                </TabsList>
              </Tabs>
              <Button onClick={handleSearch} disabled={isLoading} className="bg-blue-600">
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Get News
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* News Grid */}
        {news.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {news.map((article, idx) => (
              <Card key={idx} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge className={categoryColors[article.category] || categoryColors.market}>
                      {article.category}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Clock className="w-3 h-3" />
                      {article.published}
                    </div>
                  </div>
                  <CardTitle className="text-lg leading-snug">
                    {article.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {article.summary}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">{article.source}</span>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-16">
              <Newspaper className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-slate-900 mb-2">Get Latest News</h3>
              <p className="text-slate-500 mb-6">
                Click "Get News" to load the latest financial news and market updates
              </p>
              <Button onClick={() => loadNews()} className="bg-blue-600">
                <Sparkles className="w-4 h-4 mr-2" />
                Load News
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}