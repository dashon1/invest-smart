import React, { useState, useEffect } from "react";
import { Portfolio, InvestmentGoal, LearningProgress } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer 
} from "recharts";
import { 
  TrendingUp, 
  DollarSign, 
  Target,
  BookOpen,
  Calendar,
  PieChart as PieChartIcon
} from "lucide-react";

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function Analytics() {
  const [portfolio, setPortfolio] = useState([]);
  const [goals, setGoals] = useState([]);
  const [progress, setProgress] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState("30d");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [portfolioData, goalsData, progressData] = await Promise.all([
        Portfolio.filter({ is_simulation: true }),
        InvestmentGoal.list(),
        LearningProgress.list()
      ]);
      setPortfolio(portfolioData);
      setGoals(goalsData);
      setProgress(progressData);
    } catch (error) {
      console.error("Error loading analytics data:", error);
    }
  };

  // Portfolio Distribution Data
  const portfolioDistribution = portfolio.map(holding => ({
    name: holding.stock_symbol,
    value: (holding.current_price || holding.purchase_price) * holding.shares
  }));

  // Goals Progress Data
  const goalsProgressData = goals.map(goal => ({
    name: goal.goal_name,
    progress: (goal.current_amount / goal.target_amount) * 100,
    current: goal.current_amount,
    target: goal.target_amount
  }));

  // Learning Progress Data
  const learningData = [
    { category: 'Basics', completed: progress.filter(p => p.module_id?.includes('basics') && p.completed).length, total: 2 },
    { category: 'Risk', completed: progress.filter(p => p.module_id?.includes('risk') && p.completed).length, total: 1 },
    { category: 'Portfolio', completed: progress.filter(p => p.module_id?.includes('portfolio') && p.completed).length, total: 1 },
    { category: 'Advanced', completed: progress.filter(p => p.module_id?.includes('advanced') && p.completed).length, total: 1 }
  ];

  // Mock Performance Data (in real app, track over time)
  const performanceData = [
    { date: 'Week 1', value: 10000 },
    { date: 'Week 2', value: 10150 },
    { date: 'Week 3', value: 10080 },
    { date: 'Week 4', value: 10320 },
    { date: 'Week 5', value: 10500 }
  ];

  const totalValue = portfolio.reduce((sum, h) => 
    sum + ((h.current_price || h.purchase_price) * h.shares), 0
  );

  return (
    <div className="p-4 md:p-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
            📊 Analytics & Insights
          </h1>
          <p className="text-slate-600 text-lg">
            Detailed breakdown of your investment journey
          </p>
        </div>

        <Tabs defaultValue="portfolio" className="space-y-6">
          <TabsList>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
            <TabsTrigger value="learning">Learning</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="portfolio" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChartIcon className="w-5 h-5 text-blue-500" />
                    Portfolio Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {portfolio.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={portfolioDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {portfolioDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[300px] flex items-center justify-center text-slate-500">
                      No portfolio data yet
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-500" />
                    Holdings Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {portfolio.map((holding, idx) => {
                      const value = (holding.current_price || holding.purchase_price) * holding.shares;
                      const percentage = (value / totalValue) * 100;
                      
                      return (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">{holding.stock_symbol}</span>
                            <span>${value.toFixed(2)} ({percentage.toFixed(1)}%)</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                    {portfolio.length === 0 && (
                      <p className="text-center text-slate-500 py-8">
                        Start trading to see your holdings
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="goals" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-green-500" />
                  Goals Progress Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                {goals.length > 0 ? (
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={goalsProgressData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value, name) => {
                          if (name === 'progress') return `${value.toFixed(1)}%`;
                          return `$${value.toFixed(2)}`;
                        }}
                      />
                      <Legend />
                      <Bar dataKey="current" fill="#3b82f6" name="Current Amount" />
                      <Bar dataKey="target" fill="#10b981" name="Target Amount" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[400px] flex items-center justify-center text-slate-500">
                    No goals set yet
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="learning" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-purple-500" />
                  Learning Progress by Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={learningData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="completed" fill="#8b5cf6" name="Completed" />
                    <Bar dataKey="total" fill="#e0e7ff" name="Total" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  Portfolio Performance Over Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      name="Portfolio Value"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}