/**
 * Booking document shape returned by the project's existing bookings API
 * (GET NEXT_PUBLIC_BOOKING_EDIT_API_URL/:email). Field names mirror the real
 * MongoDB documents — nothing is invented on the frontend.
 */

export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";


export type Booking = {
  _id: string;
  studioId?: string;
  studioName?: string;
  renterId?: string;
  renterName?: string;
  email?: string;
  bookingDate?: string;
  startTime?: string;
  endTime?: string;
  time?: string;
  guests?: number;
  totalHours?: number;
  hourlyRate?: number;
  securityDeposit?: number;
  amount?: number;
  status?: string;
  createdAt?: string;
};

/** Studio fields used to enrich booking cards (bookings don't embed them). */
export type BookingStudio = {
  title?: string;
  image?: string;
  category?: string;
  location?: string;
};

const BOOKING_STATUSES: BookingStatus[] = [
  "pending",
  "confirmed",
  "completed",
  "cancelled",
];

/** Unknown or missing status safely defaults to "pending". */
export function normalizeStatus(status?: string): BookingStatus {
  const value = status?.trim().toLowerCase();
  return BOOKING_STATUSES.includes(value as BookingStatus)
    ? (value as BookingStatus)
    : "pending";
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}/;

/** Formats the API's "2026-11-19" (or full ISO) date as "November 19, 2026". */
export function formatBookingDate(value?: string): string {
  if (!value) return "N/A";
  const date = new Date(ISO_DATE.test(value) ? value.slice(0, 10) : value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatMoney(value?: number): string {
  return typeof value === "number" && Number.isFinite(value)
    ? `$${value.toFixed(2)}`
    : "N/A";
}

export function formatHours(value?: number): string {
  if (typeof value !== "number" || !Number.isFinite(value)) return "N/A";
  return `${Math.round(value * 100) / 100} h`;
}

/** Sort key for Newest/Oldest — falls back from createdAt to bookingDate. */
export function bookingTimestamp(booking: Booking): string {
  return booking.createdAt ?? booking.bookingDate ?? "";
}
