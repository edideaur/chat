import { Hono } from "hono"
import type { AppEnv } from "./types"

const app = new Hono<AppEnv>()

app.all("/api/*", (c) => c.json({ error: "not_found" }, 404))

app.all("*", (c) => c.env.ASSETS.fetch(c.req.raw))

export default app
