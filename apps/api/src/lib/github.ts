const GITHUB_API_BASE = "https://api.github.com";
import { getEnv } from "./env.js";

export interface GitHubStats {
  username: string;
  publicRepos: number;
  followers: number;
  totalStars: number;
  topLanguages: string[];
  contributions: number;
  streak: number;
  profileUrl: string;
  isMock?: boolean;
}

interface GitHubUserResponse {
  login: string;
  public_repos: number;
  followers: number;
  html_url: string;
}

interface GitHubRepoResponse {
  stargazers_count: number;
  language: string | null;
}

interface GitHubGraphQLResponse {
  data?: {
    user?: {
      contributionsCollection?: {
        contributionCalendar?: {
          weeks: Array<{
            contributionDays: Array<{
              contributionCount: number;
              date: string;
            }>;
          }>;
        };
      };
    };
  };
}

function calculateCurrentStreak(days: Array<{ contributionCount: number; date: string }>) {
  const orderedDays = [...days].sort((a, b) => b.date.localeCompare(a.date));
  let streak = 0;

  for (const day of orderedDays) {
    if (day.contributionCount > 0) {
      streak += 1;
      continue;
    }

    if (day.date === new Date().toISOString().split("T")[0]) {
      continue;
    }

    break;
  }

  return streak;
}

export async function fetchGitHubStats(username: string): Promise<GitHubStats> {
  const token = getEnv("GITHUB_TOKEN");

  if (!token) {
    return {
      username,
      publicRepos: 18,
      followers: 24,
      totalStars: 62,
      topLanguages: ["TypeScript", "Go", "React"],
      contributions: 87,
      streak: 12,
      profileUrl: `https://github.com/${username}`,
      isMock: true,
    };
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    "User-Agent": "SpacedCode-Portfolio",
    Accept: "application/vnd.github+json",
  };

  const [userResponse, reposResponse, contributionsResponse] = await Promise.all([
    fetch(`${GITHUB_API_BASE}/users/${username}`, { headers }),
    fetch(`${GITHUB_API_BASE}/users/${username}/repos?per_page=100&sort=updated`, {
      headers,
    }),
    fetch(`${GITHUB_API_BASE}/graphql`, {
      method: "POST",
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          query($username: String!) {
            user(login: $username) {
              contributionsCollection {
                contributionCalendar {
                  weeks {
                    contributionDays {
                      contributionCount
                      date
                    }
                  }
                }
              }
            }
          }
        `,
        variables: { username },
      }),
    }),
  ]);

  if (!userResponse.ok || !reposResponse.ok || !contributionsResponse.ok) {
    throw new Error("Failed to fetch GitHub stats");
  }

  const user = (await userResponse.json()) as GitHubUserResponse;
  const repos = (await reposResponse.json()) as GitHubRepoResponse[];
  const contributionData = (await contributionsResponse.json()) as GitHubGraphQLResponse;

  const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
  const topLanguages = Object.entries(
    repos.reduce<Record<string, number>>((accumulator, repo) => {
      if (repo.language) {
        accumulator[repo.language] = (accumulator[repo.language] || 0) + 1;
      }
      return accumulator;
    }, {})
  )
    .sort(([, left], [, right]) => right - left)
    .slice(0, 5)
    .map(([language]) => language);

  const contributionDays =
    contributionData.data?.user?.contributionsCollection?.contributionCalendar?.weeks.flatMap(
      (week) => week.contributionDays
    ) || [];

  const recentContributionDays = contributionDays.slice(-7);
  const contributions = recentContributionDays.reduce(
    (sum, day) => sum + day.contributionCount,
    0
  );
  const streak = calculateCurrentStreak(contributionDays);

  return {
    username: user.login,
    publicRepos: user.public_repos,
    followers: user.followers,
    totalStars,
    topLanguages,
    contributions,
    streak,
    profileUrl: user.html_url,
  };
}
