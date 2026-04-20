import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

const app = new Hono();

const starSchema = z.object({
  email: z.string().email(),
  problemSlug: z.string().min(1),
  problemTitle: z.string().min(1),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
});

// Schema for email subscription
const subscribeSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
});

// Schema for contact form
const contactSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  message: z.string().min(10),
});

// POST /api/user/subscribe - Subscribe to newsletter
app.post("/subscribe", zValidator("json", subscribeSchema), async (c) => {
  try {
    const { email, name } = c.req.valid("json");
    
    // In a real implementation, you would:
    // 1. Store in database
    // 2. Send welcome email via Resend
    // 3. Add to mailing list
    
    console.log(`New subscription: ${email} (${name || "No name"})`);
    
    return c.json({
      success: true,
      message: "Successfully subscribed to newsletter!",
      data: { email, name },
    });
  } catch (error) {
    console.error("Error subscribing user:", error);
    return c.json({
      success: false,
      message: "Failed to subscribe. Please try again.",
    }, 500);
  }
});

// POST /api/user/contact - Send contact message
app.post("/contact", zValidator("json", contactSchema), async (c) => {
  try {
    const { email, name, message } = c.req.valid("json");
    
    // In a real implementation, you would:
    // 1. Store in database
    // 2. Send email notification via Resend
    // 3. Send auto-reply to user
    
    console.log(`New contact message from ${name} (${email}): ${message.substring(0, 50)}...`);
    
    return c.json({
      success: true,
      message: "Message sent successfully! I'll get back to you soon.",
      data: { email, name },
    });
  } catch (error) {
    console.error("Error sending contact message:", error);
    return c.json({
      success: false,
      message: "Failed to send message. Please try again.",
    }, 500);
  }
});

// GET /api/user/profile/:email - Get user profile
app.get("/profile/:email", async (c) => {
  try {
    const email = c.req.param("email");
    
    // Import Redis client
    const { getUserStats, getUserStarredProblems } = await import("../lib/redis.js");
    
    const [stats, problems] = await Promise.all([
      getUserStats(email),
      getUserStarredProblems(email),
    ]);
    
    return c.json({
      success: true,
      data: {
        email,
        profile: {
          joinedAt: new Date().toISOString(), // In real app, get from DB
          totalProblemsStarred: problems.length,
          lastActive: stats?.lastStarredAt || new Date().toISOString(),
          streak: 0, // Calculate streak logic
        },
        stats,
        recentProblems: problems.slice(0, 5),
      },
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return c.json({
      success: false,
      message: "Failed to fetch user profile",
    }, 500);
  }
});

// GET /api/user/stats - Get global stats
app.get("/stats", async (c) => {
  try {
    const { getGlobalStats } = await import("../lib/redis.js");
    const globalStats = await getGlobalStats();
    
    return c.json({
      success: true,
      data: {
        globalStats,
        updatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error fetching global stats:", error);
    return c.json({
      success: false,
      message: "Failed to fetch global stats",
    }, 500);
  }
});

export default app;
// POST /api/user/star - queue a problem for spaced repetition review
app.post("/star", zValidator("json", starSchema), async (c) => {
  try {
    const { email, problemSlug, problemTitle, difficulty } = c.req.valid("json");
    const { starProblem } = await import("../lib/redis.js");

    const success = await starProblem(email, problemSlug, problemTitle, difficulty);

    if (!success) {
      return c.json(
        {
          success: false,
          message: "Failed to queue this problem for review.",
        },
        500
      );
    }

    return c.json({
      success: true,
      message: "Problem starred successfully. You'll be reminded to review it in 3 days.",
      data: {
        email,
        problemSlug,
        reviewDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
    });
  } catch (error) {
    console.error("Error starring problem:", error);
    return c.json(
      {
        success: false,
        message: "Failed to star problem.",
      },
      500
    );
  }
});
