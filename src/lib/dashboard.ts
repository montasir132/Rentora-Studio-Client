/**
 * Dashboard data layer — real MongoDB queries only.
 *
 * The `bookings` and `studios` collections are read as they exist today;
 * when they are empty (or not yet created) the summary honestly reports
 * zeros and empty lists so the UI can show proper empty states.
 */
import { db } from "@/lib/auth";
import { isHostAccount } from "@/lib/session";

export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";

export type RenterStats = {
  totalBookings: number;
  upcomingBookings: number;
  pendingBookings: number;
  completedBookings: number;
};

export type HostStats = {
  totalListings: number;
  activeStudios: number;
  pendingBookingRequests: number;
  confirmedBookings: number;
};

export type RecentBooking = {
  id: string;
  studioName: string;
  bookingDate: string | null;
  time: string;
  amount: number;
  status: BookingStatus;
};

export type RecentListing = {
  id: string;
  name: string;
  category: string;
  hourlyRate: number;
  image: string | null;
  status: "active" | "inactive";
};

export type DashboardSummary = {
  isHost: boolean;
  renter: RenterStats;
  host: HostStats | null;
  recentBookings: RecentBooking[];
  recentListings: RecentListing[];
};

type BookingDoc = {
  _id: unknown;
  renterId?: string;
  hostId?: string;
  studioName?: string;
  bookingDate?: Date | string | number;
  time?: string;
  amount?: number;
  status?: string;
  createdAt?: Date;
};

type StudioDoc = {
  _id: unknown;
  hostId?: string;
  name?: string;
  category?: string;
  hourlyRate?: number;
  image?: string | null;
  status?: string;
  createdAt?: Date;
};

const BOOKING_STATUSES: BookingStatus[] = [
  "pending",
  "confirmed",
  "completed",
  "cancelled",
];

function toIsoDate(value: BookingDoc["bookingDate"]): string | null {
  if (value === undefined || value === null) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function mapBooking(doc: BookingDoc): RecentBooking {
  const status = BOOKING_STATUSES.includes(doc.status as BookingStatus)
    ? (doc.status as BookingStatus)
    : "pending";
  return {
    id: String(doc._id),
    studioName: doc.studioName ?? "Studio booking",
    bookingDate: toIsoDate(doc.bookingDate),
    time: doc.time ?? "—",
    amount: typeof doc.amount === "number" ? doc.amount : 0,
    status,
  };
}

function mapListing(doc: StudioDoc): RecentListing {
  return {
    id: String(doc._id),
    name: doc.name ?? "Untitled studio",
    category: doc.category ?? "other",
    hourlyRate: typeof doc.hourlyRate === "number" ? doc.hourlyRate : 0,
    image: doc.image ?? null,
    status: doc.status === "inactive" ? "inactive" : "active",
  };
}

/**
 * Full booking list for a renter (most recent first).
 * Used by /my-bookings and the dashboard summary.
 */
export async function listRenterBookings(
  renterId: string,
  limit = 50
): Promise<RecentBooking[]> {
  const docs = await db
    .collection<BookingDoc>("bookings")
    .find({ renterId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();
  return docs.map(mapBooking);
}

/** Booking requests that arrived on this host's studios. */
export async function listHostBookings(
  hostId: string,
  limit = 50
): Promise<RecentBooking[]> {
  const docs = await db
    .collection<BookingDoc>("bookings")
    .find({ hostId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();
  return docs.map(mapBooking);
}

/** All studio listings owned by this host. */
export async function listHostListings(
  hostId: string,
  limit = 50
): Promise<RecentListing[]> {
  const docs = await db
    .collection<StudioDoc>("studios")
    .find({ hostId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();
  return docs.map(mapListing);
}

/**
 * Builds the full dashboard summary for one user.
 * Renter numbers always come from the user's own bookings; host numbers are
 * only computed (and returned) when the account has verified host permission.
 */
export async function getDashboardSummary(user: {
  id: string;
  email: string;
}): Promise<DashboardSummary> {
  const bookings = db.collection<BookingDoc>("bookings");
  const studios = db.collection<StudioDoc>("studios");
  const now = new Date();

  const isHost = await isHostAccount(user.email);

  const [
    totalBookings,
    upcomingBookings,
    pendingBookings,
    completedBookings,
    recentBookings,
  ] = await Promise.all([
    bookings.countDocuments({ renterId: user.id }),
    bookings.countDocuments({
      renterId: user.id,
      status: "confirmed",
      bookingDate: { $gte: now },
    }),
    bookings.countDocuments({ renterId: user.id, status: "pending" }),
    bookings.countDocuments({ renterId: user.id, status: "completed" }),
    listRenterBookings(user.id, 5),
  ]);

  const renter: RenterStats = {
    totalBookings,
    upcomingBookings,
    pendingBookings,
    completedBookings,
  };

  let host: HostStats | null = null;
  let recentListings: RecentListing[] = [];

  if (isHost) {
    const [totalListings, activeStudios, pendingBookingRequests, confirmedBookings, listings] =
      await Promise.all([
        studios.countDocuments({ hostId: user.id }),
        studios.countDocuments({ hostId: user.id, status: "active" }),
        bookings.countDocuments({ hostId: user.id, status: "pending" }),
        bookings.countDocuments({ hostId: user.id, status: "confirmed" }),
        listHostListings(user.id, 5),
      ]);

    host = { totalListings, activeStudios, pendingBookingRequests, confirmedBookings };
    recentListings = listings;
  }

  return {
    isHost,
    renter,
    host,
    recentBookings,
    recentListings,
  };
}
