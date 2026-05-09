import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { TrendingUp, Users, Calendar, Target } from "lucide-react";

interface StatsDashboardProps {
  starredCount: number;
  totalUsers: number;
  activeToday: number;
}

const StatsDashboard: React.FC<StatsDashboardProps> = ({
  starredCount,
  totalUsers,
  activeToday,
}) => {
  const completionRate = starredCount === 0 ? "0%" : "100%";
  const avgReviewTime = starredCount === 0 ? "3.0 days" : "3.0 days";

  return (
    <Card className="border-slate-200 dark:border-slate-700/80 bg-white/90 dark:bg-slate-900/95 text-slate-900 dark:text-slate-50 shadow-lg dark:shadow-2xl shadow-black/5 dark:shadow-black/20 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-green-500/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-50">
          <TrendingUp className="w-5 h-5 text-green-400" />
          Dashboard
        </CardTitle>
        <CardDescription className="text-slate-500 dark:text-slate-400">Real-time spaced repetition metrics</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Problems Queued */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500 dark:text-gray-400">Problems Queued for Review</span>
            <span className="text-2xl font-bold text-green-400">{starredCount}</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(starredCount * 5, 100)}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 dark:text-gray-500">
            {starredCount === 0 
              ? "Star your first problem to start tracking!" 
              : `You have ${starredCount} problem${starredCount !== 1 ? 's' : ''} scheduled for review`}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-50 dark:bg-gray-900/50 p-3 rounded-lg border border-slate-100 dark:border-transparent transition-colors duration-300">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span className="text-sm text-slate-500 dark:text-gray-400">Total Users</span>
            </div>
            <div className="text-xl font-semibold">{totalUsers}</div>
          </div>
          
          <div className="bg-slate-50 dark:bg-gray-900/50 p-3 rounded-lg border border-slate-100 dark:border-transparent transition-colors duration-300">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
              <span className="text-sm text-slate-500 dark:text-gray-400">Active Today</span>
            </div>
            <div className="text-xl font-semibold">{activeToday}</div>
          </div>
          
          <div className="bg-slate-50 dark:bg-gray-900/50 p-3 rounded-lg border border-slate-100 dark:border-transparent transition-colors duration-300">
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="text-sm text-slate-500 dark:text-gray-400">Completion Rate</span>
            </div>
            <div className="text-xl font-semibold">{completionRate}</div>
          </div>
          
          <div className="bg-slate-50 dark:bg-gray-900/50 p-3 rounded-lg border border-slate-100 dark:border-transparent transition-colors duration-300">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm text-slate-500 dark:text-gray-400">Avg. Review Time</span>
            </div>
            <div className="text-xl font-semibold">{avgReviewTime}</div>
          </div>
        </div>

        {/* Spaced Repetition Timeline */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-700/80 transition-colors duration-300">
          <h4 className="font-medium mb-3 text-sm text-slate-800 dark:text-slate-200">Spaced Repetition Timeline</h4>
          <div className="space-y-3">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-3"></div>
              <div className="flex-1">
                <div className="flex justify-between text-sm">
                  <span>Day 0</span>
                  <span className="text-slate-500 dark:text-gray-400">Learn</span>
                </div>
                <div className="text-xs text-slate-400 dark:text-gray-500">Initial exposure to problem</div>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-yellow-500 mr-3"></div>
              <div className="flex-1">
                <div className="flex justify-between text-sm">
                  <span>Day 3</span>
                  <span className="text-slate-500 dark:text-gray-400">First review</span>
                </div>
                <div className="text-xs text-slate-400 dark:text-gray-500">Retention ~60%</div>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-3"></div>
              <div className="flex-1">
                <div className="flex justify-between text-sm">
                  <span>Day 7</span>
                  <span className="text-slate-500 dark:text-gray-400">Second review</span>
                </div>
                <div className="text-xs text-slate-400 dark:text-gray-500">Retention ~90%</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsDashboard;
