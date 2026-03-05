import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-72bfe855/health", (c) => {
  return c.json({ status: "ok" });
});

// --- Contact Endpoints ---

// Submit contact form
app.post("/make-server-72bfe855/contact", async (c) => {
  try {
    const body = await c.req.json();
    
    if (!body.name || !body.email || !body.message) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    const id = crypto.randomUUID();
    const submission = {
      id,
      ...body,
      submittedAt: new Date().toISOString(),
    };

    // Store in KV store with prefix
    await kv.set(`submission:${id}`, submission);

    return c.json({ success: true, id });
  } catch (error) {
    console.error("Error processing contact form:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Get all contact submissions
app.get("/make-server-72bfe855/contact", async (c) => {
  try {
    const submissions = await kv.getByPrefix("submission:");
    // Sort by date descending
    submissions.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
    return c.json(submissions);
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// --- News Endpoints ---

// Get all news
app.get("/make-server-72bfe855/news", async (c) => {
  try {
    const news = await kv.getByPrefix("news:");
    // Sort by date descending (assuming ISO string or similar in date field, or we add created_at)
    // The current frontend uses display dates like "4 Feb, 2026", so we might need a real timestamp for sorting.
    news.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    return c.json(news);
  } catch (error) {
    console.error("Error fetching news:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Create news item
app.post("/make-server-72bfe855/news", async (c) => {
  try {
    const body = await c.req.json();
    const id = crypto.randomUUID();
    const newsItem = {
      id,
      ...body,
      createdAt: Date.now(), // For sorting
    };
    
    await kv.set(`news:${id}`, newsItem);
    return c.json({ success: true, id });
  } catch (error) {
    console.error("Error creating news:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Delete news item
app.delete("/make-server-72bfe855/news/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await kv.del(`news:${id}`);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting news:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

Deno.serve(app.fetch);
