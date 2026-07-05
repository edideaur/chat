import { createBrowserRouter } from "react-router-dom"

import { App } from "@/App"
import { ChatPage } from "@/routes/chat"
import { OAuthCallback } from "@/routes/oauth-callback"

export const router = createBrowserRouter([
  { path: "/oauth/callback", element: <OAuthCallback /> },
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <ChatPage /> },
      { path: "c/:id", element: <ChatPage /> },
    ],
  },
])
