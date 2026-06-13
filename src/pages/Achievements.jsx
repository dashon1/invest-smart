import React, { useState, useEffect } from "react";
import { Achievement, LearningProgress, Portfolio, InvestmentGoal } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Trophy, 
  Star,
  Award,
  Target,
  BookOpen,
  TrendingUp,
  Users,
  Zap,
  Lock
} from "lucide-react";

const availableAchievements = [
  {
    id: "first_trade",
    title: "First Trade",
    description: "Complete your first practice trade",
    points: 50,
    icon: "🎯",
    category: "trading",
    requirement: { type: "portfolio", count: 1 }
  },
  {
    id: "portfolio_master",
    title: "Portfolio Master",
    description: "Hold 5 different stocks",
    points: 100,
    icon: "📊",
    category: "trading",
    requirement: { type: "portfolio", count: 5 }
  },
  {
    id: "first_module",
    title: "Knowledge Seeker",
    description: "Complete your first learning module",
    points: 50,
    icon: "📚",
    category: "learning",
    requirement: { type: "learning", count: 1 }
  },
  {
    id: "learning_master",
    title: "Investment Scholar",
    description: "Complete all 5 learning modules",
    points: 250,
    icon: "🎓",
    category: "learning",
    requirement: { type: "learning", count: 5 }
  },
  {
    id: "goal_setter",
    title: "Goal Setter",
    description: "Create your first investment goal",
    points: 50,
    icon: "🎯",
    category: "goals",
    requirement: { type: "goals", count: 1 }
  },
  {
    id: "goal_achiever",
    title: "Goal Achiever",
    description: "Reach 100% on any investment goal",
    points: 150,
    icon: "🏆",
    category: "goals",
    requirement: { type: "goals_completed", count: 1 }
  },
  {
    id: "week_streak",
    title: "Consistency Champion",
    description: "Maintain a 7-day learning streak",
    points: 100,
    icon: "🔥",
    category: "special",
    requirement: { type: "streak", count: 7 }
  },
  {
    id: "profitable_trader",
    title: "Profitable Trader",
    description: "Achieve $500 in practice portfolio gains",
    points: 200,
    icon: "💰",
    category: "trading",
    requirement: { type: "profit", amount: 500 }
  }
];

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState([]);
  const [stats, setStats] = useState({
    portfolio: 0,
    learning: 0,
    goals: 0,
    goalsCompleted: 0,
    totalPoints: 0
  });

  useEffect(() => {
    loadAchievements();
    loadStats();
  }, []);

  const loadAchievements = async () => {
    try {
      const data = await Achievement.list('-unlocked_date');
      setAchievements(data);
    } catch (error) {
      console.error("Error loading achievements:", error);
    }
  };

  const loadStats = async () => {
    try {
      const [portfolio, learning, goals] = await Promise.all([
        Portfolio.filter({ is_simulation: true }),
        LearningProgress.list(),
        InvestmentGoal.list()
      ]);

      const completedLearning = learning.filter(l => l.completed).length;
      const completedGoals = goals.filter(g => g.current_amount >= g.target_amount).length;

      setStats({
        portfolio: portfolio.length,
        learning: completedLearning,
        goals: goals.length,
        goalsCompleted: completedGoals,
        totalPoints: 0
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const checkAchievement = (achievement) => {
    const req = achievement.requirement;
    
    switch (req.type) {
      case "portfolio":
        return stats.portfolio >= req.count;
      case "learning":
        return stats.learning >= req.count;
      case "goals":
        return stats.goals >= req.count;
      case "goals_completed":
        return stats.goalsCompleted >= req.count;
      default:
        return false;
    }
  };

  const getProgress = (achievement) => {
    const req = achievement.requirement;
    let current = 0;
    let total = req.count || 1;

    switch (req.type) {
      case "portfolio":
        current = stats.portfolio;
        break;
      case "learning":
        current = stats.learning;
        break;
      case "goals":
        current = stats.goals;
        break;
      case "goals_completed":
        current = stats.goalsCompleted;
        break;
      default:
        current = 0;
    }

    return Math.min((current / total) * 100, 100);
  };

  const isUnlocked = (achievementId) => {
    return achievements.some(a => a.achievement_id === achievementId);
  };

  const totalPointsEarned = achievements.reduce((sum, a) => sum + (a.points_earned || 0), 0);
  const unlockedCount = achievements.length;
  const totalCount = availableAchievements.length;

  const getCategoryIcon = (category) => {
    const icons = {
      learning: BookOpen,
      trading: TrendingUp,
      goals: Target,
      social: Users,
      special: Zap
    };
    return icons[category] || Award;
  };

  return (
    <div className="p-4 md:p-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            🏆 Achievements & Badges
          </h1>
          <p className="text-slate-600 text-lg">
            Track your progress and unlock rewards as you learn
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-6 h-6" />
                Total Points
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{totalPointsEarned}</div>
              <p className="text-amber-100 mt-1">Keep earning to unlock more!</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-6 h-6" />
                Badges Earned
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{unlockedCount}/{totalCount}</div>
              <Progress value={(unlockedCount / totalCount) * 100} className="mt-2 bg-white/20" />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-teal-500 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-6 h-6" />
                Rank
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">
                {totalPointsEarned < 100 ? "Novice" : totalPointsEarned < 500 ? "Learner" : "Expert"}
              </div>
              <p className="text-green-100 mt-1">Based on total points</p>
            </CardContent>
          </Card>
        </div>

        {/* Achievements Grid */}
        <Tabs defaultValue="all">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="learning">📚 Learning</TabsTrigger>
            <TabsTrigger value="trading">📈 Trading</TabsTrigger>
            <TabsTrigger value="goals">🎯 Goals</TabsTrigger>
            <TabsTrigger value="special">⚡ Special</TabsTrigger>
          </TabsList>

          {["all", "learning", "trading", "goals", "special"].map(category => (
            <TabsContent key={category} value={category}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableAchievements
                  .filter(a => category === "all" || a.category === category)
                  .map((achievement, idx) => {
                    const unlocked = isUnlocked(achievement.id);
                    const canUnlock = checkAchievement(achievement);
                    const progress = getProgress(achievement);
                    const CategoryIcon = getCategoryIcon(achievement.category);

                    return (
                      <Card 
                        key={idx}
                        className={`transition-all ${
                          unlocked 
                            ? 'ring-2 ring-amber-400 bg-gradient-to-br from-amber-50 to-orange-50' 
                            : canUnlock 
                              ? 'ring-2 ring-blue-300 bg-blue-50/30'
                              : 'opacity-75'
                        }`}
                      >
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="w-16 h-16 bg-gradient-to-r from-slate-200 to-slate-300 rounded-2xl flex items-center justify-center text-3xl relative">
                              {unlocked ? (
                                <span>{achievement.icon}</span>
                              ) : (
                                <Lock className="w-8 h-8 text-slate-400" />
                              )}
                              {unlocked && (
                                <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center">
                                  <Star className="w-5 h-5 text-white fill-current" />
                                </div>
                              )}
                            </div>
                            <Badge className="bg-blue-100 text-blue-800">
                              +{achievement.points} pts
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <h3 className="font-bold text-lg text-slate-900 mb-2">
                            {achievement.title}
                          </h3>
                          <p className="text-sm text-slate-600 mb-4">
                            {achievement.description}
                          </p>

                          <div className="flex items-center gap-2 mb-2 text-sm text-slate-500">
                            <CategoryIcon className="w-4 h-4" />
                            <span className="capitalize">{achievement.category}</span>
                          </div>

                          {!unlocked && (
                            <div>
                              <div className="flex justify-between text-xs text-slate-600 mb-1">
                                <span>Progress</span>
                                <span>{progress.toFixed(0)}%</span>
                              </div>
                              <Progress value={progress} className="h-2" />
                              {canUnlock && !unlocked && (
                                <Badge className="mt-3 bg-green-100 text-green-800 w-full justify-center">
                                  🎉 Ready to claim!
                                </Badge>
                              )}
                            </div>
                          )}

                          {unlocked && (
                            <Badge className="mt-3 bg-amber-100 text-amber-800 w-full justify-center">
                              ✅ Unlocked!
                            </Badge>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}