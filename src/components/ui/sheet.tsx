import * as React from "react"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"

import { cn } from "@/lib/utils"

function Sheet({ ...props }: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root data-slot="sheet" {...props} />
}

function SheetTrigger({ ...props }: DialogPrimitive.Trigger.Props) {
  return <DialogPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}

/** Bottom sheet for touch screens: full-width, slides up from the bottom edge,
 * dismissed by the backdrop, Escape/back, or dragging the handle down. */
function SheetContent({
  className,
  children,
  onDismiss,
  ...props
}: DialogPrimitive.Popup.Props & { onDismiss?: () => void }) {
  const popupRef = React.useRef<HTMLDivElement>(null)
  const drag = React.useRef<{ startY: number; dy: number } | null>(null)

  const onPointerDown = (e: React.PointerEvent) => {
    drag.current = { startY: e.clientY, dy: 0 }
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e: React.PointerEvent) => {
    const popup = popupRef.current
    if (!drag.current || !popup) return
    drag.current.dy = Math.max(0, e.clientY - drag.current.startY)
    popup.style.transition = "none"
    popup.style.transform = `translateY(${drag.current.dy}px)`
  }
  const onPointerEnd = () => {
    const popup = popupRef.current
    if (!drag.current || !popup) return
    const { dy } = drag.current
    drag.current = null
    popup.style.transition = ""
    popup.style.transform = ""
    if (dy > 90) onDismiss?.()
  }

  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Backdrop
        data-slot="sheet-overlay"
        className="fixed inset-0 isolate z-50 bg-black/30 duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0"
      />
      <DialogPrimitive.Popup
        ref={popupRef}
        data-slot="sheet-content"
        initialFocus={popupRef}
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 flex max-h-[75svh] flex-col rounded-t-2xl bg-popover pb-[env(safe-area-inset-bottom)] text-sm text-popover-foreground ring-1 ring-foreground/10 duration-200 outline-none data-open:animate-in data-open:slide-in-from-bottom-[100%] data-closed:animate-out data-closed:slide-out-to-bottom-[100%]",
          className
        )}
        {...props}
      >
        <div
          className="flex shrink-0 cursor-grab touch-none justify-center py-2.5"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerEnd}
          onPointerCancel={onPointerEnd}
        >
          <div className="h-1 w-10 rounded-full bg-muted-foreground/30" />
        </div>
        {children}
      </DialogPrimitive.Popup>
    </DialogPrimitive.Portal>
  )
}

export { Sheet, SheetContent, SheetTrigger }
