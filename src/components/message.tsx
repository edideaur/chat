import { memo, useState } from "react"
import { Check, Copy, Pencil, RefreshCw } from "lucide-react"

import { Markdown } from "@/components/markdown"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { editResend, regenerate } from "@/lib/generation"
import type { Message } from "@/lib/db"

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <Button
      variant="ghost"
      size="icon-xs"
      className="text-muted-foreground"
      aria-label="Copy message"
      onClick={() => {
        void navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
      }}
    >
      {copied ? <Check className="text-primary" /> : <Copy />}
    </Button>
  )
}

export const MessageBubble = memo(function MessageBubble({
  message,
  canRegenerate = false,
}: {
  message: Message
  canRegenerate?: boolean
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState("")

  if (message.role === "user") {
    if (editing) {
      return (
        <div className="flex flex-col items-end gap-2">
          <Textarea
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="min-h-20 w-full max-w-[85%]"
          />
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={!draft.trim()}
              onClick={() => {
                setEditing(false)
                void editResend(message.id, draft.trim())
              }}
            >
              Save & send
            </Button>
          </div>
        </div>
      )
    }
    return (
      <div className="group/msg flex flex-col items-end gap-1">
        <div className="max-w-[85%] rounded-2xl rounded-br-md bg-secondary px-4 py-2.5 text-[0.95rem] whitespace-pre-wrap">
          {message.content}
        </div>
        <div className="flex opacity-0 transition-opacity group-hover/msg:opacity-100">
          <CopyButton text={message.content} />
          <Button
            variant="ghost"
            size="icon-xs"
            className="text-muted-foreground"
            aria-label="Edit message"
            onClick={() => {
              setDraft(message.content)
              setEditing(true)
            }}
          >
            <Pencil />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="group/msg flex flex-col gap-1">
      {message.model && (
        <span className="text-xs text-muted-foreground">{message.model}</span>
      )}
      <div>
        <Markdown text={message.content} />
        {message.status === "streaming" && (
          <span className="mt-1 inline-block h-4 w-2 animate-pulse rounded-xs bg-primary/70" />
        )}
      </div>
      {message.status === "error" && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {message.error}
        </p>
      )}
      {message.status !== "streaming" && (
        <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover/msg:opacity-100">
          <CopyButton text={message.content} />
          {canRegenerate && (
            <Button
              variant="ghost"
              size="icon-xs"
              className="text-muted-foreground"
              aria-label="Regenerate response"
              onClick={() => void regenerate(message.id)}
            >
              <RefreshCw />
            </Button>
          )}
          {message.status === "stopped" && message.content && (
            <span className="text-xs text-muted-foreground">stopped</span>
          )}
        </div>
      )}
    </div>
  )
})
