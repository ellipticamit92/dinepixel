import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StarRating } from "@/components/atoms/star-rating";

export function TestimonialCard({
  quote,
  name,
  role,
}: {
  quote: string;
  name: string;
  role: string;
}) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("");

  return (
    <div className="flex flex-col gap-4 rounded-2xl border bg-card p-6">
      <StarRating />
      <p className="text-sm text-muted-foreground">&ldquo;{quote}&rdquo;</p>
      <div className="mt-auto flex items-center gap-3 pt-2">
        <Avatar className="size-8">
          <AvatarFallback className="bg-secondary text-xs text-secondary-foreground">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-foreground">{name}</span>
          <span className="text-xs text-muted-foreground">{role}</span>
        </div>
      </div>
    </div>
  );
}
