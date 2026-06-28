import { Leaf, Quote } from "lucide-react";
import { PortalCard } from "@/components/features/volunteer/portal/PortalCard";

type FactoidCardProps = {
  fact: string;
};

export function FactoidCard({ fact }: FactoidCardProps) {
  return (
    <PortalCard variant="sage" className="relative p-6">
      <Quote
        size={24}
        className="absolute left-4 top-4 text-[#2C5E3B]/25 dark:text-[#8fd4a8]/30"
        aria-hidden
      />
      <div className="relative z-10 ml-6">
        <h4 className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1f4d2c] dark:text-[#8fd4a8]">
          <Leaf size={14} className="text-[#2C5E3B] dark:text-[#8fd4a8]" aria-hidden />
          Impact Fact
        </h4>
        <p className="text-sm font-semibold italic leading-relaxed text-[#2a3d30] dark:text-[#7dd4a3]">
          &ldquo;{fact}&rdquo;
        </p>
      </div>
    </PortalCard>
  );
}