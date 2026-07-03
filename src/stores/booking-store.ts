import { create } from "zustand";
import type { Car } from "@/types";

interface BookingDraft {
  carId: string;
  car?: Car;
  startDate: string;
  endDate: string;
  pickupLocation: string;
  dropoffLocation?: string;
  totalDays: number;
  totalPrice: number;
  depositAmount?: number;
  guestMode: boolean;
  clientFirstName?: string;
  clientLastName?: string;
  clientEmail?: string;
  clientPhone?: string;
  clientCin?: string;
  clientDrivingLicense?: string;
  clientNotes?: string;
}

interface BookingState {
  draft: BookingDraft | null;
  step: number;
  setDraft: (draft: Partial<BookingDraft> & { carId: string }) => void;
  updateDraft: (data: Partial<BookingDraft>) => void;
  setStep: (step: number) => void;
  clearDraft: () => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  draft: null,
  step: 0,

  setDraft: (draft) =>
    set((state) => ({
      draft: { ...state.draft, ...draft, guestMode: draft.guestMode ?? true } as BookingDraft,
      step: 0,
    })),

  updateDraft: (data) =>
    set((state) => ({
      draft: state.draft ? { ...state.draft, ...data } : null,
    })),

  setStep: (step) => set({ step }),

  clearDraft: () => set({ draft: null, step: 0 }),
}));
