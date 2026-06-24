export type WordmarkProps = {
  className?: string;
  size?: "header" | "footer";
};

const sizeClass = {
  header: "text-[1.65rem] tracking-[0.06em]",
  footer: "text-[1.875rem] tracking-[0.06em]",
};

export function Wordmark({ className = "", size = "header" }: WordmarkProps) {
  return (
    <span
      className={`font-bold leading-none text-[#D97757] transition-colors duration-200 ${sizeClass[size]} ${className}`}
    >
      foodbridge
    </span>
  );
}