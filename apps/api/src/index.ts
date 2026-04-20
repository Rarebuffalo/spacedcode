import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { getEnv } from "./lib/env.js";

// Import routes
import leetcodeRoutes from "./routes/leetcode.js";
import userRoutes from "./routes/user.js";
import devRoutes from "./routes/dev.js";

const app = new Hono();

// Middleware
app.use("*", logger());
app.use(
  "*",
  cors({
    origin: [
      getEnv("CORS_ORIGIN") || "http://127.0.0.1:5173",
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "http://localhost:3000",
      "https://spacedcode.vercel.app",
    ],
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  })
);

// Health check
app.get("/", (c) => {
  return c.json({
    message: "SpacedCode API",
    version: "1.0.0",
    status: "healthy",
    timestamp: new Date().toISOString(),
    endpoints: {
      leetcode: "/api/leetcode/*",
      user: "/api/user/*",
    },
  });
});

// API routes
app.route("/api/leetcode", leetcodeRoutes);
app.route("/api/user", userRoutes);
app.route("/api/dev", devRoutes);

// 404 handler
app.notFound((c) => {
  return c.json(
    {
      success: false,
      message: "Endpoint not found",
      path: c.req.path,
    },
    404
  );
});

// Error handler
app.onError((err, c) => {
  console.error("API Error:", err);
  return c.json(
    {
      success: false,
      message: "Internal server error",
      error: getEnv("NODE_ENV") === "development" ? err.message : undefined,
    },
    500
  );
});

export default app;
