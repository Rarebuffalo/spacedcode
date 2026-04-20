import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

const app = new Hono();

// Types for LeetCode response
interface LeetCodeProblem {
  title: string;
  titleSlug: string;
  difficulty: "Easy" | "Medium" | "Hard";
  topicTags: Array<{ name: string; slug: string }>;
  isPaidOnly: boolean;
  content?: string;
}

interface LeetCodeDailyResponse {
  data: {
    activeDailyCodingChallengeQuestion: {
      date: string;
      link: string;
      question: LeetCodeProblem;
    };
  };
}

// Schema for request validation
const starProblemSchema = z.object({
  email: z.string().email(),
  problemSlug: z.string(),
  problemTitle: z.string(),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
});

// Mock data for fallback
const mockDailyProblem: LeetCodeProblem = {
  title: "Two Sum",
  titleSlug: "two-sum",
  difficulty: "Easy",
  topicTags: [
    { name: "Array", slug: "array" },
    { name: "Hash Table", slug: "hash-table" },
  ],
  isPaidOnly: false,
  content: "Given an array of integers nums and an integer target...",
};

// GET /api/leetcode/daily - Fetch daily LeetCode problem
app.get("/daily", async (c) => {
  try {
    // Try to fetch from LeetCode GraphQL API
    const graphqlQuery = {
      query: `
        query questionOfToday {
          activeDailyCodingChallengeQuestion {
            date
            link
            question {
              title
              titleSlug
              difficulty
              topicTags {
                name
                slug
              }
              isPaidOnly
              content
            }
          }
        }
      `,
    };

    const response = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0",
      },
      body: JSON.stringify(graphqlQuery),
    });

    if (!response.ok) {
      throw new Error(`LeetCode API responded with ${response.status}`);
    }

    const data: LeetCodeDailyResponse = await response.json();
    const question = data.data.activeDailyCodingChallengeQuestion.question;

    return c.json({
      success: true,
      data: {
        title: question.title,
        slug: question.titleSlug,
        difficulty: question.difficulty,
        link: `https://leetcode.com${data.data.activeDailyCodingChallengeQuestion.link}`,
        tags: question.topicTags.map((tag) => tag.name),
        isPaidOnly: question.isPaidOnly,
        date: data.data.activeDailyCodingChallengeQuestion.date,
      },
    });
  } catch (error) {
    console.error("Error fetching daily LeetCode problem:", error);
    
    // Fallback to mock data
    return c.json({
      success: true,
      data: {
        title: mockDailyProblem.title,
        slug: mockDailyProblem.titleSlug,
        difficulty: mockDailyProblem.difficulty,
        link: `https://leetcode.com/problems/${mockDailyProblem.titleSlug}`,
        tags: mockDailyProblem.topicTags.map((tag) => tag.name),
        isPaidOnly: mockDailyProblem.isPaidOnly,
        date: new Date().toISOString().split("T")[0],
        isMock: true, // Flag to indicate this is mock data
      },
    });
  }
});

// POST /api/leetcode/star - Star a problem for review
app.post("/star", zValidator("json", starProblemSchema), async (c) => {
  try {
    const { email, problemSlug, problemTitle, difficulty } = c.req.valid("json");
    
    // Import Redis client
    const { starProblem } = await import("../lib/redis.js");
    
    const success = await starProblem(email, problemSlug, problemTitle, difficulty);
    
    if (success) {
      return c.json({
        success: true,
        message: "Problem starred successfully. You'll be reminded in 3 days.",
        data: {
          email,
          problemSlug,
          starredAt: new Date().toISOString(),
        },
      });
    } else {
      return c.json({
        success: false,
        message: "Failed to star problem. Please try again.",
      }, 500);
    }
  } catch (error) {
    console.error("Error starring problem:", error);
    return c.json({
      success: false,
      message: "Internal server error",
    }, 500);
  }
});

// GET /api/leetcode/stats/:email - Get user's starred problems
app.get("/stats/:email", async (c) => {
  try {
    const email = c.req.param("email");
    
    // Import Redis client
    const { getUserStarredProblems, getUserStats } = await import("../lib/redis.js");
    
    const [problems, stats] = await Promise.all([
      getUserStarredProblems(email),
      getUserStats(email),
    ]);
    
    return c.json({
      success: true,
      data: {
        email,
        totalStarred: problems.length,
        problems,
        stats,
      },
    });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return c.json({
      success: false,
      message: "Failed to fetch user stats",
    }, 500);
  }
});

export default app;