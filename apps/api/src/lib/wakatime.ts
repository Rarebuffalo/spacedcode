import { getEnv } from "./env.js";

export interface WakaTimeStats {
  hours: number;
  dailyAverageHours: number;
  languages: string[];
  isMock?: boolean;
}

interface WakaTimeResponse {
  data: {
    total_seconds: number;
    languages: Array<{
      name: string;
      total_seconds: number;
    }>;
  };
}

export async function fetchWakaTimeStats(): Promise<WakaTimeStats> {
  const apiKey = getEnv("WAKATIME_API_KEY");

  if (!apiKey) {
    return {
      hours: 38.2,
      dailyAverageHours: 5.5,
      languages: ["TypeScript", "Go", "Python"],
      isMock: true,
    };
  }

  const authToken = Buffer.from(apiKey).toString("base64");
  const response = await fetch("https://wakatime.com/api/v1/users/current/stats/last_7_days", {
    headers: {
      Authorization: `Basic ${authToken}`,
      "User-Agent": "SpacedCode-Portfolio",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch WakaTime stats");
  }

  const data = (await response.json()) as WakaTimeResponse;
  const totalSeconds = data.data.total_seconds;
  const hours = Number((totalSeconds / 3600).toFixed(1));

  return {
    hours,
    dailyAverageHours: Number((hours / 7).toFixed(1)),
    languages: data.data.languages.slice(0, 5).map((language) => language.name),
  };
}
