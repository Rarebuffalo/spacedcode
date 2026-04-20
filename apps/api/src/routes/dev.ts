import { Hono } from "hono";
import { getEnv } from "../lib/env.js";
import { fetchGitHubStats } from "../lib/github.js";
import { getCachedDevStats, setCachedDevStats } from "../lib/redis.js";
import { fetchWakaTimeStats } from "../lib/wakatime.js";

const app = new Hono();

app.get("/stats", async (c) => {
  const username = getEnv("GITHUB_USERNAME") || "Rarebuffalo";
  const cacheKey = `dev-stats:${username}`;

  try {
    const cachedStats = await getCachedDevStats(cacheKey);
    if (cachedStats) {
      return c.json({
        success: true,
        data: cachedStats,
        cached: true,
      });
    }

    const [github, wakatime] = await Promise.all([
      fetchGitHubStats(username),
      fetchWakaTimeStats(),
    ]);

    const stats = {
      github,
      wakatime,
      updatedAt: new Date().toISOString(),
    };

    await setCachedDevStats(cacheKey, stats, 60 * 60);

    return c.json({
      success: true,
      data: stats,
      cached: false,
    });
  } catch (error) {
    console.error("Error fetching developer stats:", error);
    return c.json(
      {
        success: false,
        message: "Failed to fetch developer stats",
      },
      500
    );
  }
});

export default app;
