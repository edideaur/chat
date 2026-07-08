import { useEffect, useState } from "react"

/** Popup landing page: relays the authorization code to the opener and closes. */
export function OAuthCallback() {
  const [message, setMessage] = useState("Completing authorization…")

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    // A ".n"-suffixed state means the native app started this flow in an
    // in-app browser tab: relay the code back via deep link instead.
    if (params.get("state")?.endsWith(".n")) {
      setMessage("Returning to the app…")
      location.href = `chat4x://mcp-oauth?${params.toString()}`
      return
    }
    const bc = new BroadcastChannel("mcp-oauth")
    bc.postMessage({
      state: params.get("state"),
      code: params.get("code") ?? undefined,
      error:
        params.get("error_description") ??
        params.get("error") ??
        (params.get("code") ? undefined : "No authorization code returned."),
    })
    bc.close()
    setMessage("Authorization complete — you can close this window.")
    setTimeout(() => window.close(), 500)
  }, [])

  return (
    <div className="flex h-svh items-center justify-center">
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  )
}
