import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { BookOpen, TrendingUp, Sparkles } from "lucide-react";

export default function WelcomeCard() {
  return (
    <Card className="bg-gradient-to-r from-blue-600 to-green-500 text-white border-none shadow-xl">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Welcome to InvestSmart! 🎯</h2>
            <p className="text-blue-100 text-lg">
              Your journey to financial freedom starts here
            </p>
          </div>
          <Sparkles className="w-8 h-8 text-yellow-300" />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-blue-100 mb-6">
          Learn investing fundamentals, practice with virtual money, and build confidence 
          before investing real money. We'll guide you every step of the way!
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link to={createPageUrl("Learn")} className="flex-1">
            <Button variant="secondary" className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30">
              <BookOpen className="w-4 h-4 mr-2" />
              Start Learning
            </Button>
          </Link>
          <Link to={createPageUrl("Practice")} className="flex-1">
            <Button variant="secondary" className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30">
              <TrendingUp className="w-4 h-4 mr-2" />
              Try Practice Mode
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}