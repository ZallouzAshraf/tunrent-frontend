import { apiClient } from "./client";
export { getErrorMessage } from "./client";
import type {
  Agency,
  AgencyUser,
  AuthResponse,
  Booking,
  Car,
  DashboardLoginResponse,
  MarketplaceCarSearchParams,
  Notification,
  PaginatedResult,
  Payment,
  PublicBookingStatus,
  PublicCarAvailability,
  Review,
  StatsOverview,
  User,
  PlanChangeRequest,
  PlatformStats,
} from "@/types";

// Auth
export const authApi = {
  register: (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
  }) => apiClient.post<{ message: string; user: User }>("/auth/register", data),

  login: (data: { email: string; password: string }) =>
    apiClient.post<AuthResponse>("/auth/login", data),

  dashboardLogin: (data: {
    email: string;
    password: string;
    agencyId?: string;
  }) => apiClient.post<DashboardLoginResponse>("/dashboard/auth/login", data),

  logout: () => apiClient.post("/auth/logout"),

  logoutAll: () => apiClient.post("/auth/logout-all"),

  me: () => apiClient.get<{ user: User; agencyId?: string; agencyRole?: string }>("/auth/me"),

  forgotPassword: (email: string) =>
    apiClient.post("/auth/forgot-password", { email }),

  resetPassword: (token: string, password: string) =>
    apiClient.post("/auth/reset-password", { token, password }),

  verifyEmail: (email: string, code: string) =>
    apiClient.post<{ message: string }>("/auth/verify-email", { email, code }),

  resendVerification: (email: string) =>
    apiClient.post<{ message: string }>("/auth/resend-verification", { email }),

  /** @deprecated token link flow */
  verifyEmailToken: (token: string) =>
    apiClient.get(`/auth/verify-email/${token}`),
};

// Marketplace
export interface FeaturedReview {
  id: string;
  clientName: string;
  agencyName: string;
  governorate: string | null;
  rating: number;
  comment: string;
  createdAt: string;
}

export const marketplaceApi = {
  getCars: (params?: MarketplaceCarSearchParams) =>
    apiClient.get<PaginatedResult<Car>>("/marketplace/cars", { params }),

  getCar: (id: string) => apiClient.get<Car>(`/marketplace/cars/${id}`),

  getAgencies: (params?: Record<string, unknown>) =>
    apiClient.get<PaginatedResult<Agency>>("/marketplace/agencies", { params }),

  getAgency: (slug: string) =>
    apiClient.get<{ agency: Agency; cars: Car[] }>(
      `/marketplace/agencies/${slug}`,
    ),

  createBooking: (data: Record<string, unknown>) =>
    apiClient.post<Booking>("/marketplace/bookings", data),

  trackBooking: (reference: string, email: string) =>
    apiClient.get<PublicBookingStatus>(
      `/marketplace/bookings/${reference}`,
      { params: { email } },
    ),

  getFeaturedReviews: () =>
    apiClient.get<FeaturedReview[]>("/marketplace/reviews/featured"),

  getReviews: (params?: {
    carId?: string;
    agencyId?: string;
    page?: number;
    limit?: number;
  }) => apiClient.get<PaginatedResult<Review>>("/marketplace/reviews", { params }),

  getCarAvailability: (
    carId: string,
    params?: { from?: string; to?: string },
  ) =>
    apiClient.get<PublicCarAvailability>(
      `/marketplace/cars/${carId}/availability`,
      { params },
    ),
};

// Public (landing)
export const publicApi = {
  contact: (data: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }) => apiClient.post<{ message: string }>("/public/contact", data),
};

// Client
export const clientApi = {
  getBookings: () => apiClient.get<Booking[]>("/client/bookings"),
  getBooking: (id: string) => apiClient.get<Booking>(`/client/bookings/${id}`),
  cancelBooking: (id: string, reason?: string) =>
    apiClient.delete<Booking>(`/client/bookings/${id}`, {
      data: reason ? { cancellationReason: reason } : undefined,
    }),
  updateProfile: (data: Partial<User>) =>
    apiClient.patch<User>("/client/profile", data),
  changePassword: (data: {
    currentPassword: string;
    newPassword: string;
  }) => apiClient.post("/client/change-password", data),
  getNotifications: () =>
    apiClient.get<Notification[]>("/client/notifications"),
  markNotificationRead: (id: string) =>
    apiClient.patch<Notification>(`/client/notifications/${id}/read`),
  getReviews: () => apiClient.get<Review[]>("/client/reviews"),
  createReview: (data: {
    bookingId: string;
    ratingOverall: number;
    ratingCarCondition?: number;
    ratingService?: number;
    ratingValue?: number;
    comment?: string;
  }) => apiClient.post<Review>("/client/reviews", data),
};

// Agencies
export const agencyApi = {
  create: (data: Record<string, unknown>) =>
    apiClient.post<{ agency: Agency; ownerUserId: string }>("/agencies", data),

  get: () => apiClient.get<Agency>("/dashboard/agency"),
  update: (data: Record<string, unknown>) =>
    apiClient.put<Agency>("/dashboard/agency", data),
};

export const billingApi = {
  getPlanRequests: () =>
    apiClient.get<PlanChangeRequest[]>("/dashboard/billing/plan-requests"),
  getPendingPlanRequest: () =>
    apiClient.get<PlanChangeRequest | null>(
      "/dashboard/billing/plan-requests/pending",
    ),
  requestPlanChange: (requestedPlan: string, note?: string) =>
    apiClient.post<PlanChangeRequest>("/dashboard/billing/plan-requests", {
      requestedPlan,
      note,
    }),
  cancelPendingPlanRequest: () =>
    apiClient.delete<PlanChangeRequest>(
      "/dashboard/billing/plan-requests/pending",
    ),
};

// Dashboard
export const dashboardApi = {
  // Cars
  getCars: (params?: Record<string, unknown>) =>
    apiClient.get<PaginatedResult<Car>>("/dashboard/cars", { params }),
  getCar: (id: string) => apiClient.get<Car>(`/dashboard/cars/${id}`),
  createCar: (data: Record<string, unknown>) =>
    apiClient.post<Car>("/dashboard/cars", data),
  updateCar: (id: string, data: Record<string, unknown>) =>
    apiClient.put<Car>(`/dashboard/cars/${id}`, data),
  deleteCar: (id: string) => apiClient.delete(`/dashboard/cars/${id}`),
  updateCarStatus: (id: string, status: string) =>
    apiClient.patch<Car>(`/dashboard/cars/${id}/status`, { status }),
  uploadCarPhoto: (id: string, file: File) => {
    const form = new FormData();
    form.append("file", file);
    return apiClient.post<Car>(`/dashboard/cars/${id}/photos`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // Bookings
  getBookings: (params?: Record<string, unknown>) =>
    apiClient.get<PaginatedResult<Booking>>("/dashboard/bookings", { params }),
  createBooking: (data: Record<string, unknown>) =>
    apiClient.post<Booking>("/dashboard/bookings", data),
  getBooking: (id: string) =>
    apiClient.get<Booking>(`/dashboard/bookings/${id}`),
  getCalendar: () =>
    apiClient.get<{ cars: Car[]; bookings: Booking[] }>(
      "/dashboard/bookings/calendar",
    ),
  confirmBooking: (id: string) =>
    apiClient.patch<Booking>(`/dashboard/bookings/${id}/confirm`),
  rejectBooking: (id: string, rejectionReason: string) =>
    apiClient.patch<Booking>(`/dashboard/bookings/${id}/reject`, {
      rejectionReason,
    }),
  startBooking: (id: string) =>
    apiClient.patch<Booking>(`/dashboard/bookings/${id}/start`),
  completeBooking: (id: string) =>
    apiClient.patch<Booking>(`/dashboard/bookings/${id}/complete`),
  cancelBooking: (id: string, reason?: string) =>
    apiClient.patch<Booking>(`/dashboard/bookings/${id}/cancel`, {
      cancellationReason: reason,
    }),
  markBookingPaidCash: (id: string) =>
    apiClient.post<Booking>(`/dashboard/bookings/${id}/mark-paid-cash`),

  // Availability
  createBlock: (data: Record<string, unknown>) =>
    apiClient.post("/dashboard/availability/block", data),
  deleteBlock: (id: string) =>
    apiClient.delete(`/dashboard/availability/block/${id}`),
  getAvailability: (carId: string) =>
    apiClient.get(`/dashboard/availability/${carId}`),

  // Payments
  getPayments: (params?: Record<string, unknown>) =>
    apiClient.get<PaginatedResult<Payment>>("/dashboard/payments", { params }),
  createPayment: (data: Record<string, unknown>) =>
    apiClient.post<Payment>("/dashboard/payments", data),

  // Reviews
  getReviews: (params?: Record<string, unknown>) =>
    apiClient.get<PaginatedResult<Review>>("/dashboard/reviews", { params }),
  replyReview: (id: string, agencyReply: string) =>
    apiClient.post<Review>(`/dashboard/reviews/${id}/reply`, { agencyReply }),

  // Team
  getTeam: () => apiClient.get<AgencyUser[]>("/dashboard/team"),
  inviteMember: (email: string, role: string) =>
    apiClient.post("/dashboard/team/invite", { email, role }),
  updateMemberRole: (id: string, role: string) =>
    apiClient.patch<AgencyUser>(`/dashboard/team/${id}/role`, { role }),
  suspendMember: (id: string) =>
    apiClient.patch(`/dashboard/team/${id}/suspend`),
  removeMember: (id: string) => apiClient.delete(`/dashboard/team/${id}`),

  // Notifications
  getNotifications: (agencyId?: string) =>
    apiClient.get<Notification[]>("/dashboard/notifications", {
      params: agencyId ? { agencyId } : undefined,
    }),
  markRead: (id: string) =>
    apiClient.patch<Notification>(`/dashboard/notifications/${id}/read`),
  markAllRead: (agencyId?: string) =>
    apiClient.patch("/dashboard/notifications/read-all", undefined, {
      params: agencyId ? { agencyId } : undefined,
    }),

  // Stats
  getStatsOverview: () =>
    apiClient.get<StatsOverview>("/dashboard/stats/overview"),
  getBookingsChart: (months = 6) =>
    apiClient.get<{ month: string; count: number }[]>(
      "/dashboard/stats/bookings-chart",
      { params: { months } },
    ),
  getTopCars: (limit = 5) =>
    apiClient.get<{ car: Car; bookingCount: number }[]>(
      "/dashboard/stats/cars",
      { params: { limit } },
    ),
};

// Team
export const teamApi = {
  acceptInvitation: (token: string) =>
    apiClient.post<{ message: string }>("/team/accept-invitation", { token }),
};

// Admin
export const adminApi = {
  getStats: () => apiClient.get<PlatformStats>("/admin/stats"),

  getAgencies: (params?: {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => apiClient.get<PaginatedResult<Agency>>("/admin/agencies", { params }),

  getAgency: (id: string) => apiClient.get<Agency>(`/admin/agencies/${id}`),

  approveAgency: (id: string) =>
    apiClient.patch<Agency>(`/admin/agencies/${id}/approve`),

  rejectAgency: (id: string, reason: string) =>
    apiClient.patch<Agency>(`/admin/agencies/${id}/reject`, { reason }),

  suspendAgency: (id: string) =>
    apiClient.patch<Agency>(`/admin/agencies/${id}/suspend`),

  getUsers: (params?: { search?: string; page?: number; limit?: number }) =>
    apiClient.get<PaginatedResult<User>>("/admin/users", { params }),

  getPlanRequests: (params?: {
    status?: string;
    page?: number;
    limit?: number;
  }) =>
    apiClient.get<PaginatedResult<PlanChangeRequest>>("/admin/plan-requests", {
      params,
    }),

  approvePlanRequest: (id: string) =>
    apiClient.patch<PlanChangeRequest>(`/admin/plan-requests/${id}/approve`),

  rejectPlanRequest: (id: string, adminNote?: string) =>
    apiClient.patch<PlanChangeRequest>(`/admin/plan-requests/${id}/reject`, {
      adminNote,
    }),
};

// Uploads
export const uploadApi = {
  image: (file: File) => {
    const form = new FormData();
    form.append("file", file);
    return apiClient.post<{ url: string; publicId: string }>(
      "/uploads/image",
      form,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
  },
  document: (file: File) => {
    const form = new FormData();
    form.append("file", file);
    return apiClient.post<{ url: string; publicId: string }>(
      "/uploads/document",
      form,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
  },
};
