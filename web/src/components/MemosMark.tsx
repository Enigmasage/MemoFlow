import type { SVGProps } from "react";
import { cn } from "@/lib/utils";

/**
 * The Flowmark: Original MemoFlow icon.
 * Concept: A folded note combined with a flowing curved line representing thoughts
 * being captured and organized into flow.
 */
const shapes = {
  standard: {
    transform: "translate(0, 0) scale(1)",
    path: "M128 64 C92.65 64 64 92.65 64 128 L64 384 C64 419.35 92.65 448 128 448 L384 448 C419.35 448 448 419.35 448 384 L448 208 L304 64 L128 64 Z M112 136 C112 122.75 122.75 112 136 112 L272 112 L272 192 C272 209.67 286.33 224 304 224 L384 224 L384 376 C384 389.25 373.25 400 360 400 L136 400 C122.75 400 112 389.25 112 376 L112 136 Z M320 176 L320 120 L376 176 L320 176 Z M144 308 C144 292.5 156.5 280 172 280 C206 280 228 248 256 248 C284 248 306 280 340 280 C355.5 280 368 292.5 368 308 C368 323.5 355.5 336 340 336 C296 336 280 296 256 296 C232 296 216 336 172 336 C156.5 336 144 323.5 144 308 Z",
  },
  small: {
    transform: "translate(0, 0) scale(1)",
    path: "M128 64 C88 64 56 96 56 136 L56 376 C56 416 88 448 128 448 L384 448 C424 448 456 416 456 376 L456 208 L304 56 L128 64 Z M116 144 C116 128 128 116 144 116 L264 116 L264 196 C264 218 282 236 304 236 L384 236 L384 368 C384 384 372 396 356 396 L144 396 C128 396 116 384 116 368 L116 144 Z M324 176 L324 112 L388 176 L324 176 Z M140 308 C140 288 156 272 176 272 C204 272 226 244 256 244 C286 244 308 272 336 272 C356 272 372 288 372 308 C372 328 356 344 336 344 C292 344 276 304 256 304 C236 304 220 344 176 344 C156 344 140 328 140 308 Z",
  },
} as const;

type MemosMarkProps = SVGProps<SVGSVGElement> & {
  size?: number;
  variant?: keyof typeof shapes;
  label?: string;
};

/** Set color with CSS; size selects the small mark at 32px or below. */
export function MemosMark({ size = 32, variant = size <= 32 ? "small" : "standard", label, className, ...props }: MemosMarkProps) {
  const shape = shapes[variant];

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      width={size}
      height={size}
      fill="currentColor"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
      className={cn("memos-mark shrink-0 transition-transform duration-200", className)}
      {...props}
    >
      {label ? <title>{label}</title> : null}
      <g transform={shape.transform}>
        <path fill="currentColor" fillRule="evenodd" d={shape.path} />
      </g>
    </svg>
  );
}
