import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "@fontsource-variable/inter"
import "@fontsource-variable/jetbrains-mono"
import "@fontsource/pixelify-sans"
import "./index.css"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div className="flex min-h-[100svh] items-center justify-center">
      <h1 className="font-pixel text-3xl text-primary">chat</h1>
    </div>
  </StrictMode>
)
