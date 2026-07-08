// Light tactile feedback on native. The literal env guard mirrors main.tsx so
// web bundles drop the @capacitor/haptics chunk entirely; on web this is a
// no-op. Failures (e.g. haptics unavailable) are ignored.
export function haptic(style: "light" | "medium" = "light") {
  if (import.meta.env.VITE_API_BASE) {
    void import("@capacitor/haptics")
      .then(({ Haptics, ImpactStyle }) =>
        Haptics.impact({
          style: style === "medium" ? ImpactStyle.Medium : ImpactStyle.Light,
        })
      )
      .catch(() => {})
  }
}

// Streaming-reply haptics: the ChatGPT-app feel — a soft selection-tick purr
// while tokens render, a light impact when the reply completes. On both
// platforms selectionChanged() is a NO-OP outside a selectionStart()/End()
// session (the generator doesn't exist yet), so streams are ref-counted and
// the session spans first-start to last-settle. The prepared generator also
// keeps per-tick latency low, which is what makes the cadence feel crisp.
let activeStreams = 0
let lastTick = 0

export function streamHapticsStart() {
  if (!import.meta.env.VITE_API_BASE) return
  if (++activeStreams === 1) {
    void import("@capacitor/haptics")
      .then(({ Haptics }) => Haptics.selectionStart())
      .catch(() => {})
  }
}

/** Call on each content flush; rate-limits itself so concurrent streams
 * (compare mode) purr instead of buzzing. */
export function streamTick() {
  if (!import.meta.env.VITE_API_BASE || activeStreams === 0) return
  const now = Date.now()
  if (now - lastTick < 90) return
  lastTick = now
  void import("@capacitor/haptics")
    .then(({ Haptics }) => Haptics.selectionChanged())
    .catch(() => {})
}

export function streamHapticsEnd(completed: boolean) {
  if (!import.meta.env.VITE_API_BASE) return
  activeStreams = Math.max(0, activeStreams - 1)
  if (activeStreams === 0) {
    void import("@capacitor/haptics")
      .then(({ Haptics }) => Haptics.selectionEnd())
      .catch(() => {})
  }
  if (completed) haptic()
}
