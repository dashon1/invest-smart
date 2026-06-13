import React, { useState, useEffect } from "react";
import { LearningProgress } from "@/api/entities";
import ModuleCard from "../components/learn/ModuleCard";
import { BookOpen, Award, TrendingUp, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const learningModules = [
  {
    id: "basics-1",
    title: "What is Investing?",
    description: "Learn the fundamental concepts of investing, why people invest, and how investing differs from saving.",
    difficulty: "beginner",
    estimated_time: "15 min",
    rating: 4.8,
    category: "basics",
    objectives: [
      "Understand what investing means",
      "Learn the difference between saving and investing",
      "Discover why investing is important for your future",
      "Know the basic types of investments"
    ]
  },
  {
    id: "basics-2", 
    title: "Stocks vs Bonds",
    description: "Understand the two main types of investments and how they work differently in your portfolio.",
    difficulty: "beginner",
    estimated_time: "20 min",
    rating: 4.7,
    category: "basics",
    objectives: [
      "Learn what stocks and bonds are",
      "Understand the risks and rewards of each",
      "Know when to choose stocks vs bonds",
      "See real-world examples"
    ]
  },
  {
    id: "risk-1",
    title: "Understanding Investment Risk",
    description: "Learn about different types of investment risks and how to manage them effectively.",
    difficulty: "intermediate",
    estimated_time: "25 min",
    rating: 4.6,
    category: "risk",
    objectives: [
      "Identify different types of investment risks",
      "Learn risk vs reward relationship", 
      "Understand your personal risk tolerance",
      "Strategies to minimize risk"
    ]
  },
  {
    id: "portfolio-1",
    title: "Building Your First Portfolio",
    description: "Step-by-step guide to creating a balanced investment portfolio that matches your goals.",
    difficulty: "intermediate",
    estimated_time: "30 min",
    rating: 4.9,
    category: "portfolio",
    objectives: [
      "Learn portfolio diversification",
      "Understand asset allocation",
      "Create age-appropriate portfolios",
      "Rebalancing strategies"
    ]
  },
  {
    id: "advanced-1",
    title: "Market Analysis Basics",
    description: "Introduction to reading market trends, charts, and making informed investment decisions.",
    difficulty: "advanced",
    estimated_time: "35 min",
    rating: 4.5,
    category: "analysis",
    objectives: [
      "Read basic stock charts",
      "Understand market indicators",
      "Fundamental vs technical analysis",
      "Making data-driven decisions"
    ]
  }
];

export default function Learn() {
  const [userProgress, setUserProgress] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserProgress();
  }, []);

  const loadUserProgress = async () => {
    try {
      const progress = await LearningProgress.list();
      setUserProgress(progress);
    } catch (error) {
      console.error("Error loading progress:", error);
    }
    setIsLoading(false);
  };

  const handleStartModule = async (module) => {
    // In a real app, this would open the module content
    // For now, we'll simulate progress
    try {
      const existingProgress = userProgress.find(p => p.module_id === module.id);
      
      if (existingProgress) {
        await LearningProgress.update(existingProgress.id, {
          completion_percentage: Math.min(100, (existingProgress.completion_percentage || 0) + 25),
          completed: (existingProgress.completion_percentage || 0) + 25 >= 100
        });
      } else {
        await LearningProgress.create({
          module_id: module.id,
          module_title: module.title,
          completion_percentage: 25,
          completed: false
        });
      }
      
      await loadUserProgress();
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };

  const getProgressForModule = (moduleId) => {
    return userProgress.find(p => p.module_id === moduleId);
  };

  const filteredModules = learningModules.filter(module => {
    const matchesSearch = module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         module.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || module.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getOverallProgress = () => {
    if (userProgress.length === 0) return 0;
    const totalProgress = userProgress.reduce((sum, p) => sum + (p.completion_percentage || 0), 0);
    return Math.round(totalProgress / learningModules.length);
  };

  const completedModules = userProgress.filter(p => p.completed).length;

  return (
    <div className="p-4 md:p-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            📚 Investment Learning Center
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Master the fundamentals of investing through our step-by-step learning modules. 
            Start with the basics and work your way up!
          </p>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Overall Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">{getOverallProgress()}%</div>
              <p className="text-blue-100">{userProgress.length} of {learningModules.length} modules started</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-600 to-green-700 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">{completedModules}</div>
              <p className="text-green-100">Modules mastered</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Learning Streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">0</div>
              <p className="text-purple-100">Days in a row</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search learning modules..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="basics">Basics</TabsTrigger>
                  <TabsTrigger value="risk">Risk</TabsTrigger>
                  <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                  <TabsTrigger value="analysis">Analysis</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardContent>
        </Card>

        {/* Learning Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModules.map(module => (
            <ModuleCard
              key={module.id}
              module={module}
              userProgress={getProgressForModule(module.id)}
              onStart={handleStartModule}
            />
          ))}
        </div>

        {filteredModules.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-slate-900 mb-2">No modules found</h3>
              <p className="text-slate-500">Try adjusting your search or filter criteria.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}