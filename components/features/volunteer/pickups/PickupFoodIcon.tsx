import { Coffee, Leaf, ShoppingBag } from "lucide-react";
import { getFoodCategory } from "@/lib/volunteer/pickup-ui";

export function PickupFoodIcon({ foodType }: { foodType?: string }) {
  const category = getFoodCategory(foodType);
  if (category === "bakery") return <Coffee size={20} className="text-brand-coral" aria-hidden />;
  if (category === "produce")
    return <Leaf size={20} className="text-green-600 dark:text-green-400" aria-hidden />;
  return <ShoppingBag size={20} className="text-blue-600 dark:text-blue-400" aria-hidden />;
}