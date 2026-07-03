import {
  Ban,
  Bell,
  CalendarPlus,
  CheckCircle2,
  CreditCard,
  Flag,
  Star,
  UserPlus,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import type { Notification } from "@/types";

export type NotificationVisual = {
  icon: LucideIcon;
  label: string;
  iconClassName: string;
  iconBgClassName: string;
  unreadAccentClassName: string;
};

const DEFAULT_VISUAL: NotificationVisual = {
  icon: Bell,
  label: "Notification",
  iconClassName: "text-primary",
  iconBgClassName: "bg-secondary",
  unreadAccentClassName: "border-l-primary",
};

const NOTIFICATION_VISUALS: Record<string, NotificationVisual> = {
  booking_new: {
    icon: CalendarPlus,
    label: "Réservation",
    iconClassName: "text-primary",
    iconBgClassName: "bg-primary/10",
    unreadAccentClassName: "border-l-primary",
  },
  booking_confirmed: {
    icon: CheckCircle2,
    label: "Confirmée",
    iconClassName: "text-emerald-600",
    iconBgClassName: "bg-emerald-50",
    unreadAccentClassName: "border-l-emerald-500",
  },
  booking_rejected: {
    icon: XCircle,
    label: "Refusée",
    iconClassName: "text-destructive",
    iconBgClassName: "bg-destructive/10",
    unreadAccentClassName: "border-l-destructive",
  },
  booking_cancelled: {
    icon: Ban,
    label: "Annulée",
    iconClassName: "text-amber-600",
    iconBgClassName: "bg-amber-50",
    unreadAccentClassName: "border-l-amber-500",
  },
  booking_completed: {
    icon: Flag,
    label: "Terminée",
    iconClassName: "text-emerald-600",
    iconBgClassName: "bg-emerald-50",
    unreadAccentClassName: "border-l-emerald-500",
  },
  payment_received: {
    icon: CreditCard,
    label: "Paiement",
    iconClassName: "text-[var(--tunrent-gold)]",
    iconBgClassName: "bg-[var(--tunrent-gold)]/15",
    unreadAccentClassName: "border-l-[var(--tunrent-gold)]",
  },
  review_new: {
    icon: Star,
    label: "Avis",
    iconClassName: "text-[var(--tunrent-gold)]",
    iconBgClassName: "bg-[var(--tunrent-gold)]/15",
    unreadAccentClassName: "border-l-[var(--tunrent-gold)]",
  },
  invitation: {
    icon: UserPlus,
    label: "Invitation",
    iconClassName: "text-primary",
    iconBgClassName: "bg-secondary",
    unreadAccentClassName: "border-l-primary",
  },
  system: {
    icon: Bell,
    label: "Système",
    iconClassName: "text-muted-foreground",
    iconBgClassName: "bg-muted",
    unreadAccentClassName: "border-l-muted-foreground",
  },
};

export function getNotificationVisual(type: string): NotificationVisual {
  return NOTIFICATION_VISUALS[type] ?? DEFAULT_VISUAL;
}

export function getNotificationAction(
  notification: Notification,
): { href: string; label: string } | null {
  const bookingId = notification.data?.bookingId;
  if (typeof bookingId === "string") {
    if (notification.type === "review_new") {
      return { href: "/dashboard/reviews", label: "Voir les avis" };
    }
    if (notification.type === "payment_received") {
      return { href: "/dashboard/payments", label: "Voir les paiements" };
    }
    return { href: `/dashboard/bookings/${bookingId}`, label: "Voir la réservation" };
  }

  if (notification.type === "invitation") {
    return { href: "/dashboard/team", label: "Voir l'équipe" };
  }

  return null;
}

export function extractBookingReference(message: string): string | null {
  const match = message.match(/\((LOC-\d{4}-\d{5})\)/);
  return match?.[1] ?? null;
}
