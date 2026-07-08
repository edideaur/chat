import type { CapacitorConfig } from "@capacitor/cli"
import { KeyboardResize } from "@capacitor/keyboard"

const config: CapacitorConfig = {
  appId: "chat.bough.limited",
  appName: "Chat",
  webDir: "dist/client",
  plugins: {
    // iOS: don't resize the WebView — native.ts animates a --kb padding var
    // from keyboardWillShow so the layout glides with the keyboard instead of
    // snapping. Android resizes via windowSoftInputMode=adjustResize.
    Keyboard: { resize: KeyboardResize.None, resizeOnFullScreen: true },
  },
}

export default config
