import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  BookOpen, 
  Target, 
  TrendingUp, 
  Calculator,
  Lightbulb,
  Award
} from "lucide-react";

const quickActions = [
  {
    title: "Complete a Lesson",
    description: "Learn investment basics",
    icon: BookOpen,
    color: "blue",
    link: "Learn"
  },
  {
    title: "Set Investment Goal",
    description: "Define your targets",
    icon: Target,
    color: "green",
    link: "Goals"
  },
  {
    title: "Practice Trading",
    description: "Risk-free simulation",
    icon: TrendingUp,
    color: "purple",
    link: "Practice"
  },
  {
    title: "Risk Calculator",
    description: "Find your comfort zone",
    icon: Calculator,
    color: "amber",
    link: "Learn"
  }
];

export default function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-500" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {quickActions.map((action, index) => {
            const colorClasses = {
              blue: "hover:bg-blue-50 border-blue-200 hover:border-blue-300",
              green: "hover:bg-green-50 border-green-200 hover:border-green-300",
              purple: "hover:bg-purple-50 border-purple-200 hover:border-purple-300",
              amber: "hover:bg-amber-50 border-amber-200 hover:border-amber-300"
            };

            const iconColors = {
              blue: "text-blue-500",
              green: "text-green-500",
              purple: "text-purple-500",
              amber: "text-amber-500"
            };

            return (
              <Link key={index} to={createPageUrl(action.link)}>
                <Button
                  variant="outline"
                  className={`w-full h-auto p-4 flex-col items-start justify-start text-left ${colorClasses[action.color]} transition-all duration-200`}
                >
                  <div className="flex items-center gap-2 w-full mb-1">
                    <action.icon className={`w-4 h-4 ${iconColors[action.color]}`} />
                    <span className="font-medium text-sm">{action.title}</span>
                  </div>
                  <span className="text-xs text-slate-500">{action.description}</span>
                </Button>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}