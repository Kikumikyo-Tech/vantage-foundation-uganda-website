import { cn } from "@/lib/utils";

type DividerShape = "wave" | "curve" | "angle" | "tilt";
type DividerPosition = "top" | "bottom";

interface SectionDividerProps {
  shape?: DividerShape;
  position?: DividerPosition;
  toColor?: string;
  className?: string;
  flip?: boolean;
}

const paths: Record<DividerShape, string> = {
  wave: "M0,32 C320,96 640,0 960,48 C1280,96 1600,32 1920,64 L1920,128 L0,128 Z",
  curve: "M0,64 C480,128 1440,0 1920,64 L1920,128 L0,128 Z",
  angle: "M0,128 L1920,32 L1920,128 Z",
  tilt: "M0,128 L1920,64 L1920,128 L0,128 Z",
};

export function SectionDivider({
  shape = "wave",
  position = "bottom",
  toColor = "var(--surface)",
  className,
  flip = false,
}: SectionDividerProps) {
  const isTop = position === "top";
  const transform = isTop ? "rotate(180deg)" : flip ? "scaleX(-1)" : undefined;

  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none relative w-full overflow-hidden leading-[0]", className)}
      style={{ lineHeight: 0 }}
    >
      <svg
        viewBox="0 0 1920 128"
        preserveAspectRatio="none"
        className="block w-full"
        style={{
          height: "clamp(2rem, 5vw, 5rem)",
          transform,
        }}
      >
        <path d={paths[shape]} fill={toColor} />
      </svg>
    </div>
  );
}
