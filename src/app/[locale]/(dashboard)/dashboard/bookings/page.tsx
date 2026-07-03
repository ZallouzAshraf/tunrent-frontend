"use client";

import { useQuery } from "@tanstack/react-query";
import { BookingsKanbanBoard } from "@/components/dashboard/bookings-kanban-board";
import { dashboardApi } from "@/lib/api";

export default function DashboardBookingsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard", "bookings"],
    queryFn: async () => (await dashboardApi.getBookings({ limit: 100 })).data,
  });

  const bookings = data?.data ?? [];

  return <BookingsKanbanBoard bookings={bookings} isLoading={isLoading} />;
}
