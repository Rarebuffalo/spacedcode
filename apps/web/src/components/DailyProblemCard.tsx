import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "sonner";
import { Calendar, ExternalLink, Star, Loader2 } from "lucide-react";

interface DailyProblem {
  title: string;
  slug: string;
  difficulty: "Easy" | "Medium" | "Hard";
  link: string;
  tags: string[];
  isPaidOnly: boolean;
  date: string;
  isMock?: boolean;
}

interface DailyProblemCardProps {
  problem: DailyProblem;
  onStarSuccess?: () => void;
}

const DailyProblemCard: React.FC<DailyProblemCardProps> = ({ problem, onStarSuccess }) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isStarred, setIsStarred] = useState(false);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-500/20 text-green-500 border-green-500/30";
      case "Medium":
        return "bg-yellow-500/20 text-yellow-500 border-yellow-500/30";
      case "Hard":
        return "bg-red-500/20 text-red-500 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-500 border-gray-500/30";
    }
  };

  const handleStarProblem = async () => {
    if (!email) {
      toast.error("Please enter your email to star this problem");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/user/star", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          problemSlug: problem.slug,
          problemTitle: problem.title,
          difficulty: problem.difficulty,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setIsStarred(true);
        toast.success("Problem starred successfully! You'll be reminded in 3 days.");
        if (onStarSuccess) {
          onStarSuccess();
        }
      } else {
        toast.error(data.message || "Failed to star problem");
      }
    } catch (error) {
      console.error("Error starring problem:", error);
      toast.error("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card className="mx-auto w-full max-w-2xl border-slate-700/80 bg-slate-900/95 text-slate-50 shadow-2xl shadow-black/20 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold tracking-tight text-slate-50">
              LeetCode Daily Challenge
            </CardTitle>
            <CardDescription className="mt-2 flex items-center gap-2 text-slate-400">
              <Calendar className="w-4 h-4" />
              {formatDate(problem.date)}
              {problem.isMock && (
                <Badge variant="outline" className="ml-2 border-slate-600 text-xs text-slate-300">
                  Demo Data
                </Badge>
              )}
            </CardDescription>
          </div>
          <Badge className={getDifficultyColor(problem.difficulty)}>
            {problem.difficulty}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div>
          <h3 className="mb-2 text-xl font-semibold text-slate-100">{problem.title}</h3>
          <div className="flex flex-wrap gap-2 mt-3">
            {problem.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="border border-slate-700 bg-slate-800 text-xs text-slate-200"
              >
                {tag}
              </Badge>
            ))}
            {problem.isPaidOnly && (
              <Badge variant="destructive" className="text-xs">
                Premium
              </Badge>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-200">Your Email</Label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 border-slate-700 bg-slate-900/90 text-slate-50 placeholder:text-slate-500"
                disabled={isStarred}
              />
              <Button
                onClick={handleStarProblem}
                disabled={isLoading || isStarred || !email}
                className="gap-2 border border-green-500/30 bg-green-500/10 text-green-300 hover:bg-green-500/20"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : isStarred ? (
                  <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                ) : (
                  <Star className="w-4 h-4" />
                )}
                {isStarred ? "Starred" : "Star for Review"}
              </Button>
            </div>
            <p className="text-sm text-slate-400">
              Enter your email to receive a reminder in 3 days based on spaced repetition.
            </p>
          </div>

          {isStarred && (
            <div className="rounded-md border border-green-500/20 bg-green-500/10 p-3">
              <p className="flex items-center gap-2 text-sm text-green-300">
                <Star className="w-4 h-4" />
                Problem starred! You'll receive an email reminder on{" "}
                {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()}.
              </p>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between border-t border-slate-800 pt-6">
        <div className="text-sm text-slate-400">
          <p>Spaced repetition helps retain DSA concepts longer.</p>
          <p className="mt-1">Based on the Ebbinghaus forgetting curve.</p>
        </div>
        <Button
          variant="outline"
          asChild
          className="border-slate-600 text-slate-100 hover:bg-slate-800 hover:text-slate-50"
        >
          <a
            href={problem.link}
            target="_blank"
            rel="noopener noreferrer"
            className="gap-2"
          >
            Solve on LeetCode
            <ExternalLink className="w-4 h-4" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DailyProblemCard;
