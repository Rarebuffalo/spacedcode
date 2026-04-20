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
    <Card className="border-gray-700 bg-gray-800/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-400" />
          Dashboard
        </CardTitle>
        <CardDescription>Real-time spaced repetition metrics</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Problems Queued */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Problems Queued for Review</span>
            <span className="text-2xl font-bold text-green-400">{starredCount}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(starredCount * 5, 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-500">
            {starredCount === 0 
              ? "Star your first problem to start tracking!" 
              : `You have ${starredCount} problem${starredCount !== 1 ? 's' : ''} scheduled for review`}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-900/50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-gray-400">Total Users</span>
            </div>
            <div className="text-xl font-semibold">{totalUsers}</div>
          </div>
          
          <div className="bg-gray-900/50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-gray-400">Active Today</span>
            </div>
            <div className="text-xl font-semibold">{activeToday}</div>
          </div>
          
          <div className="bg-gray-900/50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-gray-400">Completion Rate</span>
            </div>
            <div className="text-xl font-semibold">{completionRate}</div>
          </div>
          
          <div className="bg-gray-900/50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-gray-400">Avg. Review Time</span>
            </div>
            <div className="text-xl font-semibold">{avgReviewTime}</div>
          </div>
        </div>

        {/* Spaced Repetition Timeline */}
        <div className="pt-4 border-t border-gray-700">
          <h4 className="font-medium mb-3 text-sm">Spaced Repetition Timeline</h4>
          <div className="space-y-3">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-3"></div>
              <div className="flex-1">
                <div className="flex justify-between text-sm">
                  <span>Day 0</span>
                  <span className="text-gray-400">Learn</span>
                </div>
                <div className="text-xs text-gray-500">Initial exposure to problem</div>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-yellow-500 mr-3"></div>
              <div className="flex-1">
                <div className="flex justify-between text-sm">
                  <span>Day 3</span>
                  <span className="text-gray-400">First review</span>
                </div>
                <div className="text-xs text-gray-500">Retention ~60%</div>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-3"></div>
              <div className="flex-1">
                <div className="flex justify-between text-sm">
                  <span>Day 7</span>
                  <span className="text-gray-400">Second review</span>
                </div>
                <div className="text-xs text-gray-500">Retention ~90%</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsDashboard;
