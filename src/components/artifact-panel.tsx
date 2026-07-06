import { useEffect, useState } from "react"
import { useLiveQuery } from "dexie-react-hooks"
import { Download, ExternalLink, Monitor, Power, RotateCw, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { latestArtifact } from "@/lib/agent-tools"
import { killConversationSandboxes } from "@/lib/e2b"
import { closeArtifactPanel, useArtifactPanel } from "@/lib/panel"

function Elapsed({ since }: { since: number }) {
  const [, tick] = useState(0)
  useEffect(() => {
    const t = setInterval(() => tick((n) => n + 1), 1000)
    return () => clearInterval(t)
  }, [])
  const s = Math.max(0, Math.floor((Date.now() - since) / 1000))
  return (
    <span className="font-mono text-xs text-muted-foreground">
      {Math.floor(s / 60)}:{String(s % 60).padStart(2, "0")}
    </span>
  )
}

const PANEL_CLASS =
  "fixed inset-0 z-40 flex flex-col bg-background md:static md:z-auto md:w-[46%] md:min-w-96 md:border-l md:border-border"
const HEADER_CLASS =
  "flex items-center gap-1 border-b border-border px-3 py-2 pt-[max(0.5rem,env(safe-area-inset-top))] md:pt-2"

export function ArtifactPanel({ convId }: { convId: string }) {
  const panel = useArtifactPanel()
  const [reloadKey, setReloadKey] = useState(0)

  const artifact = useLiveQuery(
    () =>
      panel?.kind === "artifact" && panel.convId === convId
        ? latestArtifact(convId, panel.artifactId)
        : Promise.resolve(undefined),
    [panel?.kind, panel?.kind === "artifact" ? panel.artifactId : "", panel?.convId, convId]
  )

  if (!panel || panel.convId !== convId) return null

  if (panel.kind === "computer") {
    return (
      <aside className={PANEL_CLASS}>
        <div className={HEADER_CLASS}>
          <Monitor className="size-4 shrink-0 text-primary" />
          <span className="min-w-0 flex-1 truncate text-sm font-medium">Computer</span>
          <span className="mr-1 flex items-center gap-1.5">
            <span className="size-2 animate-pulse rounded-full bg-emerald-400" />
            <Elapsed since={panel.startedAt} />
          </span>
          <Button
            variant="ghost"
            size="xs"
            className="text-destructive"
            onClick={() => {
              void killConversationSandboxes(convId)
              closeArtifactPanel()
            }}
          >
            <Power data-icon="inline-start" />
            Stop sandbox
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label="Close preview" onClick={closeArtifactPanel}>
            <X />
          </Button>
        </div>
        <iframe
          src={panel.streamUrl}
          title="Virtual desktop stream"
          className="min-h-0 w-full flex-1 border-0 bg-black"
          allow="fullscreen"
        />
      </aside>
    )
  }

  if (!artifact) return null

  const openInTab = () => {
    const url = URL.createObjectURL(new Blob([artifact.html], { type: "text/html" }))
    window.open(url, "_blank")
    setTimeout(() => URL.revokeObjectURL(url), 60_000)
  }

  const download = () => {
    const url = URL.createObjectURL(new Blob([artifact.html], { type: "text/html" }))
    const a = document.createElement("a")
    a.href = url
    a.download = `${artifact.artifactId}.html`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <aside className={PANEL_CLASS}>
      <div className={HEADER_CLASS}>
        <span className="min-w-0 flex-1 truncate text-sm font-medium">
          {artifact.title}
        </span>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Reload preview"
          onClick={() => setReloadKey((k) => k + 1)}
        >
          <RotateCw />
        </Button>
        <Button variant="ghost" size="icon-sm" aria-label="Open in new tab" onClick={openInTab}>
          <ExternalLink />
        </Button>
        <Button variant="ghost" size="icon-sm" aria-label="Download html" onClick={download}>
          <Download />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Close preview"
          onClick={closeArtifactPanel}
        >
          <X />
        </Button>
      </div>
      {/* no allow-same-origin: generated code must never reach our localStorage keys */}
      <iframe
        key={reloadKey}
        srcDoc={artifact.html}
        sandbox="allow-scripts allow-forms allow-modals allow-popups"
        title={artifact.title}
        className="min-h-0 w-full flex-1 border-0 bg-white"
      />
    </aside>
  )
}
