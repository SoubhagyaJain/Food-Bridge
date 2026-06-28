import { cn } from "@/lib/utils";

type MaterialIconProps = {
  name: string;
  className?: string;
  style?: React.CSSProperties;
};

export function MaterialIcon({ name, className, style }: MaterialIconProps) {
  return (
    <span
      className={cn("material-symbols-outlined leading-none", className)}
      style={style}
      aria-hidden
    >
      {name}
    </span>
  );
}