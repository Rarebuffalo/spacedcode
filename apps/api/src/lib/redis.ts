import { Redis } from "@upstash/redis";
import { getEnv } from "./env.js";

const redisUrl = getEnv("UPSTASH_REDIS_REST_URL");
const redisToken = getEnv("UPSTASH_REDIS_REST_TOKEN");
const redis =
  redisUrl && redisToken
    ? new Redis({
        url: redisUrl,
        token: redisToken,
      })
    : null;

const memoryProblems = new Map<string, Map<string, StarredProblem>>();
const memoryStats = new Map<string, UserStats>();
const memoryDevStats = new Map<string, { value: unknown; expiresAt: number }>();

// Types for stored data
export interface StarredProblem {
  email: string;
  problemSlug: string;
  problemTitle: string;
  difficulty: string;
  starredAt: string;
  reviewDate: string; // ISO string of when to review (now + 3 days)
}

export interface UserStats {
  email: string;
  totalStarred: number;
  lastStarredAt?: string;
}

export interface GlobalStats {
  totalUsers: number;
  totalProblemsStarred: number;
  totalReviewsScheduled: number;
  activeToday: number;
}

// Key generators
export function getUserProblemsKey(email: string): string {
  return `user:${email}:problems`;
}

export function getUserStatsKey(email: string): string {
  return `user:${email}:stats`;
}

export function getProblemKey(problemSlug: string): string {
  return `problem:${problemSlug}`;
}

// Redis operations
export async function starProblem(
  email: string,
  problemSlug: string,
  problemTitle: string,
  difficulty: string
): Promise<boolean> {
  try {
    const now = new Date();
    const reviewDate = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000); // 3 days from now

    const starredProblem: StarredProblem = {
      email,
      problemSlug,
      problemTitle,
      difficulty,
      starredAt: now.toISOString(),
      reviewDate: reviewDate.toISOString(),
    };

    if (!redis) {
      const userProblems = memoryProblems.get(email) || new Map<string, StarredProblem>();
      userProblems.set(problemSlug, starredProblem);
      memoryProblems.set(email, userProblems);

      const existingStats = memoryStats.get(email);
      memoryStats.set(email, {
        email,
        totalStarred: (existingStats?.totalStarred || 0) + 1,
        lastStarredAt: now.toISOString(),
      });

      return true;
    }

    const userProblemsKey = getUserProblemsKey(email);
    await redis.hset(userProblemsKey, {
      [problemSlug]: JSON.stringify(starredProblem),
    });
    await redis.expire(userProblemsKey, 3 * 24 * 60 * 60);

    const userStatsKey = getUserStatsKey(email);
    const existingStats = await redis.get<UserStats>(userStatsKey);
    const updatedStats: UserStats = {
      email,
      totalStarred: (existingStats?.totalStarred || 0) + 1,
      lastStarredAt: now.toISOString(),
    };
    await redis.set(userStatsKey, updatedStats);

    const problemKey = getProblemKey(problemSlug);
    await redis.set(
      problemKey,
      {
        title: problemTitle,
        difficulty,
        lastFetched: now.toISOString(),
      },
      { ex: 7 * 24 * 60 * 60 }
    );

    return true;
  } catch (error) {
    console.error("Error starring problem:", error);
    return false;
  }
}

export async function getUserStarredProblems(email: string): Promise<StarredProblem[]> {
  try {
    if (!redis) {
      return Array.from(memoryProblems.get(email)?.values() || []).sort(
        (a, b) => new Date(b.starredAt).getTime() - new Date(a.starredAt).getTime()
      );
    }

    const userProblemsKey = getUserProblemsKey(email);
    const problems = await redis.hgetall<Record<string, string>>(userProblemsKey);
    
    if (!problems) return [];

    return Object.values(problems)
      .map((problemStr) => JSON.parse(problemStr) as StarredProblem)
      .sort((a, b) => new Date(b.starredAt).getTime() - new Date(a.starredAt).getTime());
  } catch (error) {
    console.error("Error fetching user problems:", error);
    return [];
  }
}

export async function getUserStats(email: string): Promise<UserStats | null> {
  try {
    if (!redis) {
      return memoryStats.get(email) || null;
    }

    const userStatsKey = getUserStatsKey(email);
    const stats = await redis.get<UserStats>(userStatsKey);
    return stats;
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return null;
  }
}

export async function getTotalStarredCount(): Promise<number> {
  try {
    if (!redis) {
      return Array.from(memoryStats.values()).reduce(
        (sum, stats) => sum + stats.totalStarred,
        0
      );
    }

    const keys = await redis.keys("user:*:stats");
    let total = 0;
    
    for (const key of keys) {
      const stats = await redis.get<UserStats>(key);
      if (stats?.totalStarred) {
        total += stats.totalStarred;
      }
    }
    
    return total;
  } catch (error) {
    console.error("Error getting total starred count:", error);
    return 0;
  }
}

export async function getUniqueUsersCount(): Promise<number> {
  if (!redis) {
    return memoryStats.size;
  }

  try {
    const keys = await redis.keys("user:*:stats");
    return keys.length;
  } catch (error) {
    console.error("Error getting total user count:", error);
    return 0;
  }
}

export async function getActiveTodayCount(): Promise<number> {
  const isToday = (isoDate?: string) =>
    isoDate ? isoDate.split("T")[0] === new Date().toISOString().split("T")[0] : false;

  if (!redis) {
    return Array.from(memoryStats.values()).filter((stats) =>
      isToday(stats.lastStarredAt)
    ).length;
  }

  try {
    const keys = await redis.keys("user:*:stats");
    let activeToday = 0;
    for (const key of keys) {
      const stats = await redis.get<UserStats>(key);
      if (isToday(stats?.lastStarredAt)) {
        activeToday += 1;
      }
    }
    return activeToday;
  } catch (error) {
    console.error("Error getting active today count:", error);
    return 0;
  }
}

export async function getGlobalStats(): Promise<GlobalStats> {
  const [totalProblemsStarred, totalUsers, activeToday] = await Promise.all([
    getTotalStarredCount(),
    getUniqueUsersCount(),
    getActiveTodayCount(),
  ]);

  return {
    totalUsers,
    totalProblemsStarred,
    totalReviewsScheduled: totalProblemsStarred,
    activeToday,
  };
}

export async function getCachedDevStats<T>(key: string): Promise<T | null> {
  try {
    if (!redis) {
      const cached = memoryDevStats.get(key);
      if (!cached || cached.expiresAt < Date.now()) {
        return null;
      }
      return cached.value as T;
    }

    return (await redis.get<T>(key)) || null;
  } catch (error) {
    console.error("Error getting cached dev stats:", error);
    return null;
  }
}

export async function setCachedDevStats<T>(
  key: string,
  value: T,
  ttlSeconds: number
): Promise<void> {
  try {
    if (!redis) {
      memoryDevStats.set(key, {
        value,
        expiresAt: Date.now() + ttlSeconds * 1000,
      });
      return;
    }

    await redis.set(key, value, { ex: ttlSeconds });
  } catch (error) {
    console.error("Error caching dev stats:", error);
  }
}
