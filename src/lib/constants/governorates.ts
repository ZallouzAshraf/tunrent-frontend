import { Governorate } from "@/types";

export const GOVERNORATE_LABELS: Record<Governorate, { fr: string; ar: string }> = {
  [Governorate.TUNIS]: { fr: "Tunis", ar: "تونس" },
  [Governorate.ARIANA]: { fr: "Ariana", ar: "أريانة" },
  [Governorate.BEN_AROUS]: { fr: "Ben Arous", ar: "بن عروس" },
  [Governorate.MANOUBA]: { fr: "Manouba", ar: "منوبة" },
  [Governorate.NABEUL]: { fr: "Nabeul", ar: "نابل" },
  [Governorate.ZAGHOUAN]: { fr: "Zaghouan", ar: "زغوان" },
  [Governorate.BIZERTE]: { fr: "Bizerte", ar: "بنزرت" },
  [Governorate.BEJA]: { fr: "Béja", ar: "باجة" },
  [Governorate.JENDOUBA]: { fr: "Jendouba", ar: "جندوبة" },
  [Governorate.KEF]: { fr: "Le Kef", ar: "الكاف" },
  [Governorate.SILIANA]: { fr: "Siliana", ar: "سليانة" },
  [Governorate.SOUSSE]: { fr: "Sousse", ar: "سوسة" },
  [Governorate.MONASTIR]: { fr: "Monastir", ar: "المنستير" },
  [Governorate.MAHDIA]: { fr: "Mahdia", ar: "المهدية" },
  [Governorate.SFAX]: { fr: "Sfax", ar: "صفاقس" },
  [Governorate.KAIROUAN]: { fr: "Kairouan", ar: "القيروان" },
  [Governorate.KASSERINE]: { fr: "Kasserine", ar: "القصرين" },
  [Governorate.SIDI_BOUZID]: { fr: "Sidi Bouzid", ar: "سيدي بوزيد" },
  [Governorate.GABES]: { fr: "Gabès", ar: "قابس" },
  [Governorate.MEDNINE]: { fr: "Médenine", ar: "مدنين" },
  [Governorate.TATAOUINE]: { fr: "Tataouine", ar: "تطاوين" },
  [Governorate.GAFSA]: { fr: "Gafsa", ar: "قفصة" },
  [Governorate.TOZEUR]: { fr: "Tozeur", ar: "توزر" },
  [Governorate.KEBILI]: { fr: "Kébili", ar: "قبلي" },
};

export const GOVERNORATES = Object.values(Governorate);

export const CAR_CATEGORY_LABELS: Record<string, { fr: string; ar: string }> = {
  economy: { fr: "Économique", ar: "اقتصادية" },
  compact: { fr: "Compacte", ar: "مضغوطة" },
  suv: { fr: "SUV", ar: "دفع رباعي" },
  sedan: { fr: "Berline", ar: "سيدان" },
  luxury: { fr: "Luxe", ar: "فاخرة" },
  van: { fr: "Van", ar: "فان" },
  pickup: { fr: "Pick-up", ar: "بيك أب" },
  convertible: { fr: "Cabriolet", ar: "كابريوليه" },
};

export const BOOKING_STATUS_LABELS: Record<string, { fr: string; color: string }> = {
  pending: { fr: "En attente", color: "bg-amber-100 text-amber-800" },
  confirmed: { fr: "Confirmée", color: "bg-blue-100 text-blue-800" },
  rejected: { fr: "Refusée", color: "bg-red-100 text-red-800" },
  in_progress: { fr: "En cours", color: "bg-purple-100 text-purple-800" },
  completed: { fr: "Terminée", color: "bg-green-100 text-green-800" },
  cancelled: { fr: "Annulée", color: "bg-gray-100 text-gray-800" },
};

export const CAR_STATUS_LABELS: Record<string, { fr: string; color: string }> = {
  available: { fr: "Disponible", color: "bg-green-100 text-green-800" },
  rented: { fr: "Louée", color: "bg-blue-100 text-blue-800" },
  maintenance: { fr: "Maintenance", color: "bg-amber-100 text-amber-800" },
  inactive: { fr: "Inactive", color: "bg-gray-100 text-gray-800" },
};
