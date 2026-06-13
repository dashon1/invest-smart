import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function StatsCard({ title, value, change, changeType, icon: Icon, color }) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    green: "bg-green-50 text-green-700 border-green-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200"
  };

  const iconColors = {
    blue: "text-blue-500",
    green: "text-green-500",
    purple: "text-purple-500",
    amber: "text-amber-500"
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-slate-600">{title}</CardTitle>
        <Icon className={`w-5 h-5 ${iconColors[color]}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-slate-900 mb-2">{value}</div>
        {change && (
          <Badge 
            variant="outline" 
            className={`${colorClasses[color]} text-xs`}
          >
            {changeType === 'positive' ? '↗' : changeType === 'negative' ? '↘' : '→'} {change}
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}