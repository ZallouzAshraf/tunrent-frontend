import type {
  AgencyUserRole,
  BookingStatus,
  CarCategory,
  CarStatus,
  FuelType,
  Governorate,
  PaymentMethod,
  PaymentStatus,
  RoleGlobal,
  Transmission,
} from "./enums";

export * from "./enums";

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  cin?: string;
  drivingLicenseNumber?: string;
  drivingLicenseExpiry?: string;
  drivingLicensePhotoUrl?: string;
  cinPhotoUrl?: string;
  avatarUrl?: string;
  roleGlobal: RoleGlobal;
  isEmailVerified: boolean;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
  agencyId?: string;
  agencyRole?: string;
}

export interface DashboardAgencyOption {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string | null;
  role: string;
}

export interface DashboardAgencySelectionResponse {
  requiresAgencySelection: true;
  agencies: DashboardAgencyOption[];
}

export type DashboardLoginResponse = AuthResponse | DashboardAgencySelectionResponse;

export function isAgencySelectionResponse(
  res: DashboardLoginResponse,
): res is DashboardAgencySelectionResponse {
  return "requiresAgencySelection" in res && res.requiresAgencySelection === true;
}

export interface Agency {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  coverUrl?: string;
  email?: string;
  phone?: string;
  phoneWhatsapp?: string;
  address?: string;
  city?: string;
  governorate?: Governorate;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  status: string;
  plan?: string;
  isFeatured?: boolean;
  avgRating?: number;
  totalReviews?: number;
  totalBookings?: number;
  createdAt: string;
  updatedAt: string;
}

export interface PickupLocation {
  name?: string;
  city?: string;
  address: string;
  latitude?: number;
  longitude?: number;
  lat?: number;
  lng?: number;
}

export interface Car {
  id: string;
  agencyId: string;
  brand: string;
  model: string;
  year: number;
  color?: string;
  registrationNumber: string;
  vin?: string;
  category: CarCategory;
  transmission: Transmission;
  fuelType: FuelType;
  seats: number;
  doors?: number;
  hasAc: boolean;
  hasGps: boolean;
  hasBluetooth: boolean;
  hasUsb: boolean;
  hasChildSeat: boolean;
  hasInsurance: boolean;
  mileage?: number;
  pricePerDay: number | string;
  pricePerWeek?: number | string;
  depositAmount?: number | string;
  minRentalDays?: number;
  minDriverAge?: number;
  status: CarStatus;
  photos: string[];
  thumbnailUrl?: string;
  description?: string;
  pickupLocations: PickupLocation[];
  agency?: Agency;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  bookingReference: string;
  agencyId: string;
  carId: string;
  clientUserId?: string;
  clientFirstName: string;
  clientLastName: string;
  clientEmail: string;
  clientPhone: string;
  clientCin?: string;
  clientDrivingLicense?: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  pickupLocation: string;
  dropoffLocation?: string;
  pricePerDay: number | string;
  totalPrice: number | string;
  depositAmount?: number | string;
  status: BookingStatus;
  rejectionReason?: string;
  cancellationReason?: string;
  clientNotes?: string;
  agencyNotes?: string;
  confirmedAt?: string;
  createdAt: string;
  updatedAt: string;
  car?: Car;
  agency?: Agency;
  payments?: Payment[];
  review?: Review;
}

export interface PublicBookingStatus {
  bookingReference: string;
  status: BookingStatus;
  clientFirstName: string;
  clientLastName: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  totalPrice: number | string;
  pickupLocation: string;
  dropoffLocation?: string;
  car: { brand: string; model: string; year: number; thumbnailUrl?: string };
  agency: { name: string; phone?: string; email?: string };
  rejectionReason?: string;
  cancellationReason?: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  agencyId: string;
  bookingId: string;
  amount: number | string;
  currency: string;
  method: PaymentMethod;
  type: string;
  status: PaymentStatus;
  transactionId?: string;
  paidAt?: string;
  notes?: string;
  createdAt: string;
  booking?: Booking;
}

export interface Review {
  id: string;
  agencyId: string;
  carId: string;
  bookingId: string;
  clientUserId?: string;
  clientName: string;
  ratingOverall: number;
  ratingCarCondition: number;
  ratingService: number;
  ratingValue: number;
  comment?: string;
  agencyReply?: string;
  agencyRepliedAt?: string;
  isVisible: boolean;
  createdAt: string;
  car?: Car;
  booking?: Booking;
}

export interface Notification {
  id: string;
  agencyId?: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

export interface AgencyUser {
  id: string;
  agencyId: string;
  userId: string;
  role: AgencyUserRole;
  status: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

export interface PlanChangeRequest {
  id: string;
  agencyId: string;
  requestedById: string;
  currentPlan: string;
  requestedPlan: string;
  monthlyPrice: number | string;
  status: string;
  note?: string | null;
  adminNote?: string | null;
  processedById?: string | null;
  processedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  agency?: Agency;
  requestedBy?: User;
}

export interface PlatformStats {
  totalUsers: number;
  totalAgencies: number;
  agenciesByStatus: Record<string, number>;
  totalCars: number;
  totalBookings: number;
  pendingAgencies: number;
}

export interface StatsOverview {
  totalBookings: number;
  pendingBookings: number;
  activeBookings: number;
  totalCars: number;
  availableCars: number;
  totalRevenue: number | string;
  occupancyRate: number;
}

export interface MarketplaceCarSearchParams {
  governorate?: string;
  category?: string;
  start_date?: string;
  end_date?: string;
  min_price?: number;
  max_price?: number;
  transmission?: string;
  fuel_type?: string;
  has_ac?: boolean;
  has_gps?: boolean;
  has_bluetooth?: boolean;
  has_child_seat?: boolean;
  seats?: number;
  sort?: string;
  page?: number;
  limit?: number;
}
