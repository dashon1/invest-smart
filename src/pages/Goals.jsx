import React, { useState, useEffect } from "react";
import { InvestmentGoal } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Target, 
  Plus, 
  Calendar,
  DollarSign,
  Home,
  GraduationCap,
  Plane,
  PiggyBank,
  Shield,
  MoreHorizontal
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { format } from "date-fns";

const goalIcons = {
  retirement: PiggyBank,
  house: Home,
  education: GraduationCap,
  vacation: Plane,
  emergency_fund: Shield,
  other: MoreHorizontal
};

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    goal_name: "",
    target_amount: "",
    current_amount: "",
    target_date: "",
    monthly_contribution: "",
    risk_level: "moderate",
    goal_type: "other"
  });

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      const data = await InvestmentGoal.list('-created_date');
      setGoals(data);
    } catch (error) {
      console.error("Error loading goals:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await InvestmentGoal.create({
        ...formData,
        target_amount: parseFloat(formData.target_amount),
        current_amount: parseFloat(formData.current_amount || 0),
        monthly_contribution: parseFloat(formData.monthly_contribution || 0)
      });
      
      setFormData({
        goal_name: "",
        target_amount: "",
        current_amount: "",
        target_date: "",
        monthly_contribution: "",
        risk_level: "moderate",
        goal_type: "other"
      });
      setShowForm(false);
      await loadGoals();
    } catch (error) {
      console.error("Error creating goal:", error);
    }
  };

  const calculateProgress = (goal) => {
    return (goal.current_amount / goal.target_amount) * 100;
  };

  const calculateMonthsToGo = (targetDate) => {
    const now = new Date();
    const target = new Date(targetDate);
    const diffTime = target - now;
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
    return Math.max(0, diffMonths);
  };

  const getRiskColor = (riskLevel) => {
    const colors = {
      conservative: "bg-blue-100 text-blue-800",
      moderate: "bg-yellow-100 text-yellow-800", 
      aggressive: "bg-red-100 text-red-800"
    };
    return colors[riskLevel] || colors.moderate;
  };

  return (
    <div className="p-4 md:p-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
              🎯 Investment Goals
            </h1>
            <p className="text-slate-600 text-lg">
              Set clear financial targets and track your progress towards achieving them
            </p>
          </div>
          <Dialog open={showForm} onOpenChange={setShowForm}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600">
                <Plus className="w-4 h-4 mr-2" />
                Add New Goal
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create Investment Goal</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="goal_name">Goal Name</Label>
                  <Input
                    id="goal_name"
                    value={formData.goal_name}
                    onChange={(e) => setFormData({...formData, goal_name: e.target.value})}
                    placeholder="e.g., Emergency Fund"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="goal_type">Goal Type</Label>
                  <Select
                    value={formData.goal_type}
                    onValueChange={(value) => setFormData({...formData, goal_type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="retirement">Retirement</SelectItem>
                      <SelectItem value="house">House Purchase</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="vacation">Vacation</SelectItem>
                      <SelectItem value="emergency_fund">Emergency Fund</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="target_amount">Target Amount</Label>
                    <Input
                      id="target_amount"
                      type="number"
                      value={formData.target_amount}
                      onChange={(e) => setFormData({...formData, target_amount: e.target.value})}
                      placeholder="10000"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="current_amount">Current Amount</Label>
                    <Input
                      id="current_amount"
                      type="number"
                      value={formData.current_amount}
                      onChange={(e) => setFormData({...formData, current_amount: e.target.value})}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="target_date">Target Date</Label>
                  <Input
                    id="target_date"
                    type="date"
                    value={formData.target_date}
                    onChange={(e) => setFormData({...formData, target_date: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="monthly_contribution">Monthly Contribution</Label>
                  <Input
                    id="monthly_contribution"
                    type="number"
                    value={formData.monthly_contribution}
                    onChange={(e) => setFormData({...formData, monthly_contribution: e.target.value})}
                    placeholder="500"
                  />
                </div>

                <div>
                  <Label htmlFor="risk_level">Risk Level</Label>
                  <Select
                    value={formData.risk_level}
                    onValueChange={(value) => setFormData({...formData, risk_level: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="conservative">Conservative</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="aggressive">Aggressive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Goal</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Goals Grid */}
        {goals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goals.map((goal, index) => {
              const IconComponent = goalIcons[goal.goal_type] || MoreHorizontal;
              const progress = calculateProgress(goal);
              const monthsToGo = calculateMonthsToGo(goal.target_date);
              const isCompleted = progress >= 100;

              return (
                <Card key={index} className={`hover:shadow-lg transition-shadow duration-300 ${
                  isCompleted ? 'ring-2 ring-green-200 bg-green-50/30' : ''
                }`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                          <IconComponent className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{goal.goal_name}</CardTitle>
                          <Badge variant="outline" className={getRiskColor(goal.risk_level)}>
                            {goal.risk_level}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Progress */}
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-600">Progress</span>
                        <span className="font-medium">{progress.toFixed(1)}%</span>
                      </div>
                      <Progress value={Math.min(progress, 100)} className="h-3" />
                      <div className="flex justify-between text-sm mt-1 text-slate-500">
                        <span>${goal.current_amount.toLocaleString()}</span>
                        <span>${goal.target_amount.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-600">Target Date</span>
                        </div>
                        <span className="font-medium">
                          {format(new Date(goal.target_date), "MMM d, yyyy")}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-600">Monthly</span>
                        </div>
                        <span className="font-medium">
                          ${goal.monthly_contribution?.toLocaleString() || '0'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Time remaining</span>
                        <Badge variant="outline">
                          {monthsToGo} months
                        </Badge>
                      </div>
                    </div>

                    {/* Remaining amount */}
                    {!isCompleted && (
                      <div className="p-3 bg-slate-50 rounded-lg">
                        <p className="text-sm text-slate-600 mb-1">Still need</p>
                        <p className="text-xl font-bold text-slate-900">
                          ${(goal.target_amount - goal.current_amount).toLocaleString()}
                        </p>
                        {goal.monthly_contribution > 0 && monthsToGo > 0 && (
                          <p className="text-xs text-slate-500 mt-1">
                            On track with ${goal.monthly_contribution}/month
                          </p>
                        )}
                      </div>
                    )}

                    {isCompleted && (
                      <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-green-800 font-medium text-sm">
                          🎉 Goal Completed!
                        </p>
                        <p className="text-green-600 text-xs">
                          You've reached your target amount
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-16">
              <Target className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-slate-900 mb-2">Set Your First Goal</h3>
              <p className="text-slate-500 mb-6 max-w-md mx-auto">
                Having clear financial goals helps you stay motivated and focused on your investment journey.
              </p>
              <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Goal
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}