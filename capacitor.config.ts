import type { CapacitorConfig } from "@capacitor/cli"
import { KeyboardResize } from "@capacitor/keyboard"

const config: CapacitorConfig = {
  appId: "chat.bough.limited",
  appName: "Chat",
  webDir: "dist/client",
  plugins: {
    // Resize the WebView itself so h-svh layouts track the soft keyboard.
    Keyboard: { resize: KeyboardResize.Native, resizeOnFullScreen: true },
  },
}

export default config
