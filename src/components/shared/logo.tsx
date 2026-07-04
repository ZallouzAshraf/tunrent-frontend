import Image from "next/image";
import { Link } from "@/i18n/routing";
import {
  BRAND_LOGO_FULL,
  BRAND_LOGO_FULL_HEIGHT,
  BRAND_LOGO_FULL_WIDTH,
  BRAND_LOGO_ICON,
  BRAND_NAME,
} from "@/lib/constants/brand";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  /** Full wordmark image vs icon only */
  showText?: boolean;
  size?: "sm" | "md" | "lg";
  /** Light backgrounds use PNG assets; dark surfaces use icon + light text */
  surface?: "light" | "dark";
  href?: string;
  /** Set false to render without a link wrapper */
  linked?: boolean;
}

const fullHeight = { sm: 28, md: 36, lg: 44 } as const;
const iconSize = { sm: 28, md: 36, lg: 44 } as const;

export function BrandMark({
  className,
  size = "md",
}: {
  className?: string;
  size?: LogoProps["size"];
}) {
  const px = iconSize[size ?? "md"];

  return (
    <Image
      src={BRAND_LOGO_ICON}
      alt=""
      width={px}
      height={px}
      className={cn("shrink-0", className)}
      priority
    />
  );
}

export function Logo({
  className,
  showText = true,
  size = "md",
  surface = "light",
  href = "/",
  linked = true,
}: LogoProps) {
  const height = fullHeight[size];
  const iconPx = iconSize[size];

  const content =
    surface === "dark" ? (
      <>
        <BrandMark size={size} />
        {showText && (
          <span className={cn("font-bold tracking-tight", size === "sm" ? "text-base" : size === "lg" ? "text-2xl" : "text-xl")}>
            <span className="text-white">Tun</span>
            <span className="text-[var(--tunrent-gold,#d4a853)]">Rent</span>
          </span>
        )}
      </>
    ) : showText ? (
      <Image
        src={BRAND_LOGO_FULL}
        alt={BRAND_NAME}
        width={Math.round((BRAND_LOGO_FULL_WIDTH / BRAND_LOGO_FULL_HEIGHT) * height)}
        height={height}
        className="h-auto w-auto max-w-none"
        style={{ height, width: "auto" }}
        priority
      />
    ) : (
      <Image
        src={BRAND_LOGO_ICON}
        alt={BRAND_NAME}
        width={iconPx}
        height={iconPx}
        className="shrink-0"
        priority
      />
    );

  const inner = (
    <span
      className={cn(
        "inline-flex items-center gap-2.5",
        surface === "dark" && showText && "gap-2",
        className,
      )}
    >
      {content}
    </span>
  );

  if (!linked) {
    return inner;
  }

  return (
    <Link href={href} className="inline-flex transition-opacity hover:opacity-90" aria-label={`${BRAND_NAME} — Accueil`}>
      {inner}
    </Link>
  );
}
