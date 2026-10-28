"use client";

import { useEffect } from "react";

let lockCount = 0;
let restoreScroll: (() => void) | null = null;

// Modals render over the admin shell, whose main column is its own scroll
// container. Locking the document alone still lets wheel and touch gestures
// scroll that column behind the overlay, which is why the page appeared to
// move instead of the dialog.
export function useBodyScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    if (lockCount === 0) {
      const body = document.body;
      const root = document.documentElement;
      const scroller = document.querySelector<HTMLElement>("[data-admin-scroll]");
      const previous = {
        body: body.style.overflow,
        root: root.style.overflow,
        scroller: scroller?.style.overflow,
      };
      body.style.overflow = "hidden";
      root.style.overflow = "hidden";
      if (scroller) scroller.style.overflow = "hidden";
      restoreScroll = () => {
        body.style.overflow = previous.body;
        root.style.overflow = previous.root;
        if (scroller) scroller.style.overflow = previous.scroller ?? "";
      };
    }
    lockCount += 1;
    return () => {
      lockCount -= 1;
      if (lockCount === 0) {
        restoreScroll?.();
        restoreScroll = null;
      }
    };
  }, [active]);
}
