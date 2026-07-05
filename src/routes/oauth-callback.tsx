import { useEffect, useState } from "react"

/** Popup landing page: relays the authorization code to the opener and closes. */
export function OAuthCallback() {
  const [message, setMessage] = useState("Completing authorization…")

  useEffect(() => {
    const params = new URLSearchParams(location.search)
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
