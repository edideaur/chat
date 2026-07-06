import { useSyncExternalStore } from "react"

// What the side panel is showing. Module store so tool executors (non-React)
// can open it the moment an artifact or desktop session starts.
export type PanelState =
  | { kind: "artifact"; convId: string; artifactId: string }
  | { kind: "computer"; convId: string; streamUrl: string; startedAt: number }

let state: PanelState | null = null
const listeners = new Set<() => void>()
const emit = () => listeners.forEach((l) => l())

export function openArtifactPanel(convId: string, artifactId: string) {
  state = { kind: "artifact", convId, artifactId }
  emit()
}

export function openComputerPanel(convId: string, streamUrl: string) {
  // don't restart the clock if it's already open on this desktop
  if (state?.kind === "computer" && state.convId === convId && state.streamUrl === streamUrl) return
  state = { kind: "computer", convId, streamUrl, startedAt: Date.now() }
  emit()
}

export function closeArtifactPanel() {
  state = null
  emit()
}

export function useArtifactPanel(): PanelState | null {
  return useSyncExternalStore((cb) => {
    listeners.add(cb)
    return () => listeners.delete(cb)
  }, () => state)
}
