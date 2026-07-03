import { Car } from "lucide-react";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: { icon: "size-6", text: "text-lg" },
  md: { icon: "size-8", text: "text-xl" },
  lg: { icon: "size-10", text: "text-2xl" },
};

export function Logo({ className, showText = true, size = "md" }: LogoProps) {
  const sizes = sizeMap[size];

  return (
    <Link
      href="/"
      className={cn("inline-flex items-center gap-2.5 group", className)}
      aria-label="TunRent — Accueil"
    >
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20" />
        <div className="relative flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
          <Car className={cn(sizes.icon, "size-5")} aria-hidden />
        </div>
      </div>
      {showText && (
        <span className={cn("font-bold tracking-tight", sizes.text)}>
          <span className="text-primary">Tun</span>
          <span className="text-accent">Rent</span>
        </span>
      )}
    </Link>
  );
}
