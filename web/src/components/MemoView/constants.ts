import { cn } from "@/lib/utils";

export const MEMO_CARD_BASE_CLASSES =
  "relative group flex flex-col justify-start items-start bg-mu-surface w-full px-5 py-4 mb-3 gap-2.5 text-mu-ink rounded-mu-xl border border-mu-line/80 shadow-mu-key transition-all duration-150 hover:border-mu-edge hover:shadow-mu-raised";

/**
 * A memo's timestamp as a control, on the card header and in the editor: one line of muted
 * 13px text with no box, darkening on hover like every quiet label.
 */
export const MEMO_TIME_CONTROL_CLASSES = cn(
  "shrink-0 whitespace-nowrap rounded-mu-sm text-start mu-caption text-mu-ink-muted transition-colors select-none hover:text-mu-ink",
  "mu-focus",
);

export const RELATIVE_TIME_THRESHOLD_MS = 1000 * 60 * 60 * 24;
