
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  LayoutDashboard, 
  BookOpen, 
  Target, 
  TrendingUp, 
  User,
  Award,
  DollarSign,
  Eye,
  Bot,
  Users,
  Trophy,
  BarChart3,
  Newspaper
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";

const navigationItems = [
  {
    title: "Dashboard",
    url: createPageUrl("Dashboard"),
    icon: LayoutDashboard,
  },
  {
    title: "Learn",
    url: createPageUrl("Learn"),
    icon: BookOpen,
  },
  {
    title: "Practice",
    url: createPageUrl("Practice"),
    icon: TrendingUp,
  },
  {
    title: "Goals",
    url: createPageUrl("Goals"),
    icon: Target,
  },
  {
    title: "Watchlist",
    url: createPageUrl("Watchlist"),
    icon: Eye,
  },
  {
    title: "AI Advisor",
    url: createPageUrl("AIAdvisor"),
    icon: Bot,
  },
  {
    title: "Community",
    url: createPageUrl("Community"),
    icon: Users,
  },
  {
    title: "Achievements",
    url: createPageUrl("Achievements"),
    icon: Trophy,
  },
  {
    title: "Analytics",
    url: createPageUrl("Analytics"),
    icon: BarChart3,
  },
  {
    title: "News",
    url: createPageUrl("News"),
    icon: Newspaper,
  },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 to-blue-50">
        <Sidebar className="border-r border-slate-200 bg-white/80 backdrop-blur-sm">
          <SidebarHeader className="border-b border-slate-200 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 text-lg">InvestSmart</h2>
                <p className="text-xs text-slate-500">Learn. Practice. Invest.</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-3">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-medium text-slate-500 uppercase tracking-wider px-3 py-2">
                Navigation
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        className={`hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 rounded-xl mb-1 ${
                          location.pathname === item.url 
                            ? 'bg-gradient-to-r from-blue-50 to-green-50 text-blue-700 shadow-sm border-l-4 border-blue-500' 
                            : ''
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3 px-4 py-3">
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-medium text-slate-500 uppercase tracking-wider px-3 py-2">
                Your Progress
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="px-4 py-3 space-y-3">
                  <div className="flex items-center gap-3">
                    <Award className="w-4 h-4 text-amber-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-700">Learning Streak</p>
                      <p className="text-xs text-slate-500">0 days</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-4 h-4 text-blue-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-700">Modules</p>
                      <p className="text-xs text-slate-500">0% Complete</p>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
                    <p className="text-xs font-medium text-blue-700">💡 Tip of the day</p>
                    <p className="text-xs text-slate-600 mt-1">Start with the basics! Complete your first learning module to earn your first badge.</p>
                  </div>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-slate-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-900 text-sm truncate">Beginner Investor</p>
                <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                  Practice Mode
                </Badge>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 px-6 py-4 md:hidden">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-slate-100 p-2 rounded-lg transition-colors duration-200" />
              <h1 className="text-xl font-bold text-slate-900">InvestSmart</h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
