import { Hono } from "hono"
import type { AppEnv } from "../types"

// OpenCode Zen doesn't send CORS headers, so the browser can't call it directly
// like every other provider. We proxy it same-origin: `/api/opencode/<rest>` →
// `https://opencode.ai/zen/<rest>`, forwarding the user's key in the
// Authorization header per request. The key (and the prompt/response) transit
// the worker but are never stored or logged.
const opencode = new Hono<AppEnv>()

opencode.all("/*", async (c) => {
  const url = new URL(c.req.url)
  const rest = url.pathname.replace(/^\/api\/opencode\//, "")
  const target = `https://opencode.ai/zen/${rest}${url.search}`

  const headers: Record<string, string> = {}
  const auth = c.req.header("authorization")
  if (auth) headers.authorization = auth
  const ct = c.req.header("content-type")
  if (ct) headers["content-type"] = ct

  const method = c.req.method
  const upstream = await fetch(target, {
    method,
    headers,
    body: method === "GET" || method === "HEAD" ? undefined : c.req.raw.body,
  })
  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      "content-type": upstream.headers.get("content-type") ?? "application/json",
    },
  })
})

export default opencode
