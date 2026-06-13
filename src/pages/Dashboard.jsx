import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Portfolio, InvestmentGoal, LearningProgress, Notification } from "@/api/entities";
import { useQuery } from "@tanstack/react-query";
import StatsCard from "../components/dashboard/StatsCard";
import WelcomeCard from "../components/dashboard/WelcomeCard";
import QuickActions from "../components/dashboard/QuickActions";
import { 
  DollarSign, 
  TrendingUp, 
  Target, 
  BookOpen,
  AlertCircle,
  CheckCircle,
  Bell,
  X
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Dashboard() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [user, setUser] = useState(null);

  // Use React Query for better data management
  const { data: portfolio = [], isLoading: portfolioLoading } = useQuery({
    queryKey: ['portfolio'],
    queryFn: () => Portfolio.list('-created_date', 10),
  });

  const { data: goals = [], isLoading: goalsLoading } = useQuery({
    queryKey: ['goals'],
    queryFn: () => InvestmentGoal.list('-created_date', 5),
  });

  const { data: progress = [], isLoading: progressLoading } = useQuery({
    queryKey: ['learning-progress'],
    queryFn: () => LearningProgress.list('-updated_date', 10),
  });

  const { data: notifications = [], refetch: refetchNotifications } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => Notification.list('-created_date', 10),
  });

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);
    } catch (error) {
      console.error("Error loading user:", error);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await Notification.update(notificationId, { read: true });
      await refetchNotifications();
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const calculatePortfolioValue = () => {
    return portfolio.reduce((total, holding) => {
      return total + ((holding.current_price || holding.purchase_price) * holding.shares);
    }, 0);
  };

  const calculatePortfolioGain = () => {
    return portfolio.reduce((total, holding) => {
      const currentValue = (holding.current_price || holding.purchase_price) * holding.shares;
      const purchaseValue = holding.purchase_price * holding.shares;
      return total + (currentValue - purchaseValue);
    }, 0);
  };

  const getOverallProgress = () => {
    if (progress.length === 0) return 0;
    const totalProgress = progress.reduce((sum, p) => sum + (p.completion_percentage || 0), 0);
    return Math.round(totalProgress / progress.length);
  };

  const completedGoals = goals.filter(goal => goal.current_amount >= goal.target_amount).length;

  return (
    <div className="p-4 md:p-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header with Notifications */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
              Good morning{user ? `, ${user.full_name?.split(' ')[0]}` : ''}! 👋
            </h1>
            <p className="text-slate-600 text-lg">
              Ready to continue your investment journey?
            </p>
          </div>
          <div className="relative">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Button>
            {showNotifications && (
              <Card className="absolute right-0 top-12 w-80 md:w-96 z-50 shadow-xl">
                <CardHeader className="border-b">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">Notifications</CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowNotifications(false)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <ScrollArea className="h-96">
                  <CardContent className="p-0">
                    {notifications.length > 0 ? (
                      <div className="divide-y">
                        {notifications.map((notif, idx) => (
                          <div
                            key={idx}
                            className={`p-4 hover:bg-slate-50 cursor-pointer ${
                              !notif.read ? 'bg-blue-50/50' : ''
                            }`}
                            onClick={() => handleMarkAsRead(notif.id)}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                notif.priority === 'high' ? 'bg-red-100' : 
                                notif.priority === 'medium' ? 'bg-blue-100' : 'bg-slate-100'
                              }`}>
                                <Bell className="w-4 h-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm text-slate-900 mb-1">
                                  {notif.title}
                                </p>
                                <p className="text-xs text-slate-600">
                                  {notif.message}
                                </p>
                                <Badge variant="outline" className="mt-2 text-xs">
                                  {notif.type.replace('_', ' ')}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 text-center text-slate-500">
                        <Bell className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                        <p>No notifications</p>
                      </div>
                    )}
                  </CardContent>
                </ScrollArea>
              </Card>
            )}
          </div>
        </div>

        {/* Welcome Card for new users */}
        {portfolio.length === 0 && goals.length === 0 && (
          <WelcomeCard />
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Portfolio Value"
            value={`$${calculatePortfolioValue().toFixed(2)}`}
            change={portfolio.length > 0 ? `${calculatePortfolioGain() >= 0 ? '+' : ''}$${calculatePortfolioGain().toFixed(2)}` : "Start practicing!"}
            changeType={calculatePortfolioGain() >= 0 ? 'positive' : 'negative'}
            icon={DollarSign}
            color="blue"
          />
          <StatsCard
            title="Active Holdings"
            value={portfolio.length.toString()}
            change={portfolio.length > 0 ? "Practice mode" : "Get started"}
            changeType="neutral"
            icon={TrendingUp}
            color="green"
          />
          <StatsCard
            title="Learning Progress"
            value={`${getOverallProgress()}%`}
            change={`${progress.length} modules`}
            changeType="positive"
            icon={BookOpen}
            color="purple"
          />
          <StatsCard
            title="Goals Completed"
            value={`${completedGoals}/${goals.length}`}
            change={goals.length > 0 ? "Keep going!" : "Set your first goal"}
            changeType="positive"
            icon={Target}
            color="amber"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Portfolio & Goals */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Portfolio Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  Portfolio Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                {portfolio.length > 0 ? (
                  <div className="space-y-4">
                    {portfolio.slice(0, 5).map((holding, index) => {
                      const currentValue = (holding.current_price || holding.purchase_price) * holding.shares;
                      const purchaseValue = holding.purchase_price * holding.shares;
                      const gain = currentValue - purchaseValue;
                      const gainPercentage = ((gain / purchaseValue) * 100).toFixed(2);

                      return (
                        <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <div>
                            <h4 className="font-medium text-slate-900">{holding.company_name}</h4>
                            <p className="text-sm text-slate-500">{holding.shares} shares @ ${holding.purchase_price}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${currentValue.toFixed(2)}</p>
                            <Badge variant={gain >= 0 ? "default" : "destructive"} className="text-xs">
                              {gain >= 0 ? '+' : ''}${gain.toFixed(2)} ({gainPercentage}%)
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <TrendingUp className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="font-medium text-slate-900 mb-2">Start Your Portfolio</h3>
                    <p className="text-slate-500 text-sm">
                      Practice trading with virtual money to build confidence
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Investment Goals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-500" />
                  Investment Goals
                </CardTitle>
              </CardHeader>
              <CardContent>
                {goals.length > 0 ? (
                  <div className="space-y-4">
                    {goals.slice(0, 3).map((goal, index) => {
                      const progressPercentage = (goal.current_amount / goal.target_amount) * 100;
                      
                      return (
                        <div key={index} className="p-4 border border-slate-200 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-slate-900">{goal.goal_name}</h4>
                            <Badge variant="outline" className="text-xs">
                              {goal.goal_type.replace('_', ' ')}
                            </Badge>
                          </div>
                          <div className="space-y-2">
                            <Progress value={progressPercentage} className="h-2" />
                            <div className="flex justify-between text-sm text-slate-500">
                              <span>${goal.current_amount.toFixed(2)} / ${goal.target_amount.toFixed(2)}</span>
                              <span>{progressPercentage.toFixed(1)}% complete</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Target className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="font-medium text-slate-900 mb-2">Set Your Goals</h3>
                    <p className="text-slate-500 text-sm">
                      Define what you're investing for to stay motivated
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Learning & Actions */}
          <div className="space-y-6">
            {/* Learning Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-purple-500" />
                  Learning Journey
                </CardTitle>
              </CardHeader>
              <CardContent>
                {progress.length > 0 ? (
                  <div className="space-y-3">
                    {progress.slice(0, 4).map((module, index) => (
                      <div key={index} className="flex items-center gap-3">
                        {module.completed ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-amber-500" />
                        )}
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-900">{module.module_title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Progress value={module.completion_percentage || 0} className="flex-1 h-1" />
                            <span className="text-xs text-slate-500">{module.completion_percentage || 0}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <h3 className="font-medium text-slate-900 mb-1">Start Learning</h3>
                    <p className="text-slate-500 text-sm">
                      Complete modules to build your knowledge
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <QuickActions />
          </div>
        </div>
      </div>
    </div>
  );
}