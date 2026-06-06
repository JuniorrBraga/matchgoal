/* Ícones SVG compartilhados da landing (stroke = currentColor) */
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base(size: number): SVGProps<SVGSVGElement> {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };
}

export function CheckIcon({ size = 15, strokeWidth = 3, ...rest }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth} {...rest}>
      <path d="m20 6-11 11-5-5" />
    </svg>
  );
}

export function CalendarIcon({ size = 26, ...rest }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={2.2} {...rest}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 10h18M8 5v14" />
    </svg>
  );
}

export function ChartIcon({ size = 26, ...rest }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={2.2} {...rest}>
      <path d="M4 19V5M9 19v-7M14 19v-10M19 19V8" />
    </svg>
  );
}

export function ListSearchIcon({ size = 26, ...rest }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={2.2} {...rest}>
      <path d="M4 7h16M4 12h10M4 17h7" />
      <circle cx="18" cy="16" r="3" />
      <path d="m20.5 18.5 2 2" />
    </svg>
  );
}

export function WarningIcon({ size = 20, ...rest }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={2.2} {...rest}>
      <path d="M12 9v4M12 17h.01M10.3 3.9 2 18a2 2 0 0 0 1.7 3h16.6a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
    </svg>
  );
}
