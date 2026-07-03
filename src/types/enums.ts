export enum RoleGlobal {
  SUPER_ADMIN = "super_admin",
  CLIENT = "client",
}

export enum AgencyStatus {
  PENDING_VALIDATION = "pending_validation",
  ACTIVE = "active",
  SUSPENDED = "suspended",
  REJECTED = "rejected",
}

export enum AgencyUserRole {
  OWNER = "owner",
  MANAGER = "manager",
  AGENT = "agent",
}

export enum CarCategory {
  ECONOMY = "economy",
  COMPACT = "compact",
  SUV = "suv",
  SEDAN = "sedan",
  LUXURY = "luxury",
  VAN = "van",
  PICKUP = "pickup",
  CONVERTIBLE = "convertible",
}

export enum Transmission {
  MANUAL = "manual",
  AUTOMATIC = "automatic",
}

export enum FuelType {
  GASOLINE = "gasoline",
  DIESEL = "diesel",
  ELECTRIC = "electric",
  HYBRID = "hybrid",
}

export enum CarStatus {
  AVAILABLE = "available",
  RENTED = "rented",
  MAINTENANCE = "maintenance",
  INACTIVE = "inactive",
}

export enum BookingStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  REJECTED = "rejected",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export enum PaymentMethod {
  CASH = "cash",
  CARD = "card",
  FLOUCI = "flouci",
  D17 = "d17",
  CLICTOPAY = "clictopay",
  BANK_TRANSFER = "bank_transfer",
}

export enum PaymentStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
  REFUNDED = "refunded",
}

export enum MarketplaceSort {
  PRICE_ASC = "price_asc",
  PRICE_DESC = "price_desc",
  RATING_DESC = "rating_desc",
}

export enum Governorate {
  TUNIS = "tunis",
  ARIANA = "ariana",
  BEN_AROUS = "ben_arous",
  MANOUBA = "manouba",
  NABEUL = "nabeul",
  ZAGHOUAN = "zaghouan",
  BIZERTE = "bizerte",
  BEJA = "beja",
  JENDOUBA = "jendouba",
  KEF = "kef",
  SILIANA = "siliana",
  SOUSSE = "sousse",
  MONASTIR = "monastir",
  MAHDIA = "mahdia",
  SFAX = "sfax",
  KAIROUAN = "kairouan",
  KASSERINE = "kasserine",
  SIDI_BOUZID = "sidi_bouzid",
  GABES = "gabes",
  MEDNINE = "mednine",
  TATAOUINE = "tataouine",
  GAFSA = "gafsa",
  TOZEUR = "tozeur",
  KEBILI = "kebili",
}
