import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Star, BookOpen } from "lucide-react";

export default function ModuleCard({ module, userProgress, onStart }) {
  const isCompleted = userProgress?.completed || false;
  const progressPercentage = userProgress?.completion_percentage || 0;
  const quizScore = userProgress?.quiz_score;

  const difficultyColors = {
    beginner: "bg-green-100 text-green-800",
    intermediate: "bg-yellow-100 text-yellow-800",
    advanced: "bg-red-100 text-red-800"
  };

  return (
    <Card className={`hover:shadow-lg transition-all duration-300 ${
      isCompleted ? 'ring-2 ring-green-200 bg-green-50/30' : 'hover:shadow-lg'
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2 flex items-center gap-2">
              {isCompleted && <CheckCircle className="w-5 h-5 text-green-500" />}
              {module.title}
            </CardTitle>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className={difficultyColors[module.difficulty]}>
                {module.difficulty}
              </Badge>
              <div className="flex items-center gap-1 text-sm text-slate-500">
                <Clock className="w-4 h-4" />
                {module.estimated_time}
              </div>
              {module.rating && (
                <div className="flex items-center gap-1 text-sm text-slate-500">
                  <Star className="w-4 h-4 text-amber-400 fill-current" />
                  {module.rating}
                </div>
              )}
            </div>
          </div>
        </div>
        <p className="text-slate-600 text-sm leading-relaxed">{module.description}</p>
      </CardHeader>
      <CardContent className="pt-0">
        {/* Learning Objectives */}
        <div className="mb-4">
          <h4 className="font-medium text-slate-900 mb-2 text-sm">You'll learn:</h4>
          <ul className="text-sm text-slate-600 space-y-1">
            {module.objectives?.map((objective, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                {objective}
              </li>
            ))}
          </ul>
        </div>

        {/* Progress */}
        {progressPercentage > 0 && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-slate-700">Progress</span>
              <span className="text-sm text-slate-500">{progressPercentage}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            {quizScore && (
              <p className="text-xs text-slate-500 mt-1">Quiz Score: {quizScore}%</p>
            )}
          </div>
        )}

        {/* Action Button */}
        <Button 
          onClick={() => onStart(module)}
          className={`w-full ${
            isCompleted 
              ? 'bg-green-600 hover:bg-green-700' 
              : progressPercentage > 0 
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600'
          }`}
        >
          <BookOpen className="w-4 h-4 mr-2" />
          {isCompleted ? 'Review' : progressPercentage > 0 ? 'Continue' : 'Start Learning'}
        </Button>
      </CardContent>
    </Card>
  );
}