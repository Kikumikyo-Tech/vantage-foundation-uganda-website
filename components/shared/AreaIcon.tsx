import { HeartPulse, GraduationCap, HandHeart, Droplets, Lightbulb } from "lucide-react";

interface AreaIconProps {
  id: string;
  className?: string;
}

export function AreaIcon({ id, className }: AreaIconProps) {
  switch (id) {
    case "health":
      return <HeartPulse className={className} aria-hidden="true" />;
    case "education":
      return <GraduationCap className={className} aria-hidden="true" />;
    case "humanitarian":
      return <HandHeart className={className} aria-hidden="true" />;
    case "water":
      return <Droplets className={className} aria-hidden="true" />;
    case "youth-leadership":
      return <Lightbulb className={className} aria-hidden="true" />;
    default:
      return null;
  }
}
