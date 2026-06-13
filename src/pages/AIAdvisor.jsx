import React, { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { AIConversation, Portfolio, InvestmentGoal } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bot, 
  Send, 
  Sparkles, 
  TrendingUp, 
  Target,
  BookOpen,
  Loader2,
  ThumbsUp,
  ThumbsDown
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const quickPrompts = [
  { 
    text: "How should I diversify my portfolio?", 
    type: "portfolio_advice",
    icon: TrendingUp 
  },
  { 
    text: "Help me understand P/E ratios", 
    type: "learning_help",
    icon: BookOpen 
  },
  { 
    text: "Create a retirement investment plan", 
    type: "goal_planning",
    icon: Target 
  },
  { 
    text: "What are the current market trends?", 
    type: "market_question",
    icon: Sparkles 
  }
];

export default function AIAdvisor() {
  const [conversations, setConversations] = useState([]);
  const [userMessage, setUserMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [portfolio, setPortfolio] = useState([]);
  const [goals, setGoals] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [conversations]);

  const loadData = async () => {
    try {
      const [convos, portfolioData, goalsData] = await Promise.all([
        AIConversation.list('-created_date', 50),
        Portfolio.filter({ is_simulation: true }),
        InvestmentGoal.list()
      ]);
      setConversations(convos);
      setPortfolio(portfolioData);
      setGoals(goalsData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  const handleSendMessage = async (message, type = "general") => {
    if (!message.trim()) return;

    setIsLoading(true);
    try {
      // Build context
      const contextData = {
        portfolio: portfolio.map(p => ({ symbol: p.stock_symbol, shares: p.shares })),
        goals: goals.map(g => ({ name: g.goal_name, target: g.target_amount })),
        experience: "beginner"
      };

      const prompt = `You are a friendly, educational AI financial advisor helping beginner investors. 
      
User's context:
- Portfolio: ${portfolio.length} holdings
- Active goals: ${goals.length}
- Question type: ${type}

User question: ${message}

Provide a helpful, educational response in 2-3 paragraphs. Be encouraging and explain concepts simply. If relevant, reference their portfolio or goals.`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: prompt,
        add_context_from_internet: type === "market_question"
      });

      const aiResponse = typeof response === 'string' ? response : response.response || "I'm here to help! Could you rephrase that?";

      await AIConversation.create({
        user_message: message,
        ai_response: aiResponse,
        conversation_type: type,
        context_data: contextData
      });

      await loadData();
      setUserMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
    setIsLoading(false);
  };

  const handleFeedback = async (conversationId, helpful) => {
    try {
      await AIConversation.update(conversationId, { helpful });
      await loadData();
    } catch (error) {
      console.error("Error updating feedback:", error);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="p-4 md:p-6 pb-0 flex-shrink-0">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Bot className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">AI Financial Advisor</h1>
              <p className="text-slate-600">Your personal investment assistant</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden p-4 md:p-6 pt-2">
        <div className="max-w-4xl mx-auto h-full flex flex-col">
          <Card className="flex-1 flex flex-col min-h-0 shadow-xl">
            <CardContent className="flex-1 flex flex-col p-4 md:p-6 min-h-0">
              {/* Messages */}
              <ScrollArea className="flex-1 pr-4" ref={scrollRef}>
                {conversations.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="w-10 h-10 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Welcome to Your AI Advisor!</h3>
                    <p className="text-slate-600 mb-6 max-w-md mx-auto">
                      Ask me anything about investing, your portfolio, market trends, or financial planning.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
                      {quickPrompts.map((prompt, idx) => (
                        <Button
                          key={idx}
                          variant="outline"
                          className="h-auto p-4 flex flex-col items-start text-left hover:bg-blue-50 hover:border-blue-300"
                          onClick={() => handleSendMessage(prompt.text, prompt.type)}
                        >
                          <prompt.icon className="w-5 h-5 text-blue-600 mb-2" />
                          <span className="text-sm font-medium">{prompt.text}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6 pb-4">
                    {conversations.map((convo, idx) => (
                      <div key={idx} className="space-y-4">
                        {/* User Message */}
                        <div className="flex justify-end">
                          <div className="bg-blue-600 text-white rounded-2xl rounded-tr-sm px-4 py-3 max-w-[80%] shadow-md">
                            <p className="text-sm leading-relaxed">{convo.user_message}</p>
                          </div>
                        </div>

                        {/* AI Response */}
                        <div className="flex gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <Bot className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                              <Badge variant="outline" className="mb-2 text-xs">
                                {convo.conversation_type.replace('_', ' ')}
                              </Badge>
                              <p className="text-sm leading-relaxed text-slate-800 whitespace-pre-wrap">
                                {convo.ai_response}
                              </p>
                            </div>
                            <div className="flex gap-2 mt-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 text-xs"
                                onClick={() => handleFeedback(convo.id, true)}
                              >
                                <ThumbsUp className={`w-3 h-3 mr-1 ${convo.helpful === true ? 'fill-current text-green-600' : ''}`} />
                                Helpful
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 text-xs"
                                onClick={() => handleFeedback(convo.id, false)}
                              >
                                <ThumbsDown className={`w-3 h-3 mr-1 ${convo.helpful === false ? 'fill-current text-red-600' : ''}`} />
                                Not helpful
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>

              {/* Input */}
              <div className="pt-4 border-t mt-4">
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Ask me anything about investing..."
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(userMessage);
                      }
                    }}
                    className="resize-none min-h-[60px]"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={() => handleSendMessage(userMessage)}
                    disabled={isLoading || !userMessage.trim()}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  💡 Tip: Press Enter to send, Shift+Enter for new line
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}