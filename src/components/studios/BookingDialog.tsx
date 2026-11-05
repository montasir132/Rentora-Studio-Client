"use client";

import { useState } from "react";
import { Loader2, Wallet } from "lucide-react";
import { toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useSession } from "@/lib/auth-client";

type BookingDialogProps = {
  studioId: string;
  studioTitle: string;
  hourlyRate: number;
  securityDeposit: number;
  capacity: number;
};

type BookingValues = {
  date: string;
  start: string;
  end: string;
  guests: string;
};

type FieldErrors = Partial<Record<keyof BookingValues, string>>;

const EMPTY_VALUES: BookingValues = { date: "", start: "", end: "", guests: "1" };

function decimalHours(start: string, end: string): number | null {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  if (![sh, sm, eh, em].every((n) => Number.isFinite(n))) return null;
  return eh + em / 60 - (sh + sm / 60);
}

/**
 * Booking interface for a studio. Validates the requested session, shows a
 * live price summary built from the studio's real hourly rate, deposit and
 * capacity, then submits the request to the project's existing booking API
 * (`NEXT_PUBLIC_BOOKING_API_URL` → POST /booking). Success and error toasts
 * only appear after the API actually responds.
 */
export default function BookingDialog({
  studioId,
  studioTitle,
  hourlyRate,
  securityDeposit,
  capacity,
}: BookingDialogProps) {
  const { data: session, isPending: sessionPending } = useSession();
  const user = session?.user ?? null;
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<BookingValues>(EMPTY_VALUES);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [pending, setPending] = useState(false);
  // Only rendered inside the dialog (client-side after open) — no hydration risk.
  const today = new Date().toISOString().slice(0, 10);

  const setField = (key: keyof BookingValues, value: string) => {
    setValues((previous) => ({ ...previous, [key]: value }));
    setErrors((previous) => {
      if (!previous[key]) return previous;
      const next = { ...previous };
      delete next[key];
      return next;
    });
  };

  const hours = decimalHours(values.start, values.end);
  const totalHours = hours !== null && hours > 0 ? Math.round(hours * 100) / 100 : 0;
  const estimatedTotal = totalHours * hourlyRate + securityDeposit;

  const validate = (): FieldErrors => {
    const next: FieldErrors = {};

    if (!values.date) next.date = "Please choose a booking date.";
    else if (values.date < today) next.date = "Please choose today or a later date.";

    if (!values.start) next.start = "Please choose a start time.";
    if (!values.end) next.end = "Please choose an end time.";
    if (values.start && values.end) {
      const h = decimalHours(values.start, values.end);
      if (h === null || h <= 0) next.end = "End time must be after the start time.";
      else if (h > 24) next.end = "A booking can't exceed 24 hours.";
    }

    const guests = Number(values.guests);
    if (!values.guests.trim()) next.guests = "Please enter the number of guests.";
    else if (!Number.isInteger(guests) || guests < 1)
      next.guests = "Enter a whole number of at least 1.";
    else if (guests > capacity)
      next.guests = `This studio fits up to ${capacity} ${capacity === 1 ? "guest" : "guests"}.`;

    return next;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending) return; // prevent duplicate submissions
    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      toast.error("Please fix the highlighted fields.");
      return;
    }
    setErrors({});

    if (sessionPending) {
      toast.error("We're still checking your session — please try again in a moment.");
      return;
    }
    if (!user) {
      toast.error("Please log in to book this studio.");
      return;
    }
    const bookingApi = process.env.NEXT_PUBLIC_BOOKING_API_URL;
    if (!bookingApi) {
      toast.error("The booking API is not configured.");
      return;
    }

    setPending(true);
    const loadingId = toast.loading("Sending your booking request…");
    try {
      // Existing booking API: POST NEXT_PUBLIC_BOOKING_API_URL (/booking).
      const res = await fetch(bookingApi, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studioId,
          studioName: studioTitle,
          renterId: user.id,
          renterName: user.name,
          email: user.email,
          bookingDate: values.date,
          startTime: values.start,
          endTime: values.end,
          time: `${values.start} - ${values.end}`,
          guests: Number(values.guests),
          totalHours,
          hourlyRate,
          securityDeposit,
          amount: estimatedTotal,
          status: "pending",
          createdAt: new Date().toISOString(),
        }),
      });
      if (!res.ok) {
        console.error(`Booking api failed: ${res.status}`);
        throw new Error(`Request failed: ${res.status}`);
      }

      // Notifications only after the API actually responded.
      toast.success("Booking request sent successfully.", { id: loadingId });
      setOpen(false);
      setValues(EMPTY_VALUES);
    } catch {
      toast.error("Unable to send your booking request. Please try again.", {
        id: loadingId,
      });
    } finally {
      setPending(false);
    }
  };

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) {
      setValues(EMPTY_VALUES);
      setErrors({});
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button size="lg" className="w-full gap-2" />
        }
      >
        Book Workspace Now
      </DialogTrigger>

      <DialogContent className="max-h-[85vh] overflow-y-auto border-border bg-card sm:max-w-lg">
        <form onSubmit={handleSubmit} noValidate>
          <DialogHeader>
            <DialogTitle>Book This Studio</DialogTitle>
            <DialogDescription>
              Request a session at {studioTitle}.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 px-5 py-4">
            <Field>
              <FieldLabel htmlFor="booking-date">Booking Date</FieldLabel>
              <Input
                id="booking-date"
                type="date"
                min={today}
                value={values.date}
                onChange={(event) => setField("date", event.target.value)}
                aria-invalid={errors.date ? true : undefined}
                aria-describedby={errors.date ? "booking-date-error" : undefined}
              />
              {errors.date && <FieldError id="booking-date-error">{errors.date}</FieldError>}
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="booking-start">Start Time</FieldLabel>
                <Input
                  id="booking-start"
                  type="time"
                  value={values.start}
                  onChange={(event) => setField("start", event.target.value)}
                  aria-invalid={errors.start ? true : undefined}
                  aria-describedby={errors.start ? "booking-start-error" : undefined}
                />
                {errors.start && (
                  <FieldError id="booking-start-error">{errors.start}</FieldError>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="booking-end">End Time</FieldLabel>
                <Input
                  id="booking-end"
                  type="time"
                  value={values.end}
                  onChange={(event) => setField("end", event.target.value)}
                  aria-invalid={errors.end ? true : undefined}
                  aria-describedby={errors.end ? "booking-end-error" : undefined}
                />
                {errors.end && (
                  <FieldError id="booking-end-error">{errors.end}</FieldError>
                )}
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="booking-guests">Number of Guests</FieldLabel>
              <Input
                id="booking-guests"
                type="number"
                inputMode="numeric"
                min={1}
                max={capacity}
                step={1}
                value={values.guests}
                onChange={(event) => setField("guests", event.target.value)}
                aria-invalid={errors.guests ? true : undefined}
                aria-describedby={errors.guests ? "booking-guests-error" : undefined}
              />
              {errors.guests && (
                <FieldError id="booking-guests-error">{errors.guests}</FieldError>
              )}
              <FieldDescription>Maximum capacity: {capacity} guests.</FieldDescription>
            </Field>

            {/* Price summary */}
            <div className="space-y-2 rounded-xl border border-border bg-muted/50 p-4 text-sm">
              <p className="flex items-center gap-1.5 font-semibold text-foreground">
                <Wallet aria-hidden className="size-4 text-primary" />
                Price Summary
              </p>
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Total Hours</span>
                <span className="font-medium text-foreground">
                  {totalHours > 0 ? `${totalHours} h` : "—"}
                </span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Hourly Rate</span>
                <span className="font-medium text-foreground">
                  ${hourlyRate.toFixed(2)}/hr
                </span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Security Deposit</span>
                <span className="font-medium text-foreground">
                  ${securityDeposit.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-border pt-2">
                <span className="font-semibold text-foreground">Estimated Total</span>
                <span className="text-base font-bold text-primary">
                  ${estimatedTotal.toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Estimate only — the deposit is refundable after your session.
              </p>
            </div>
          </div>

          <DialogFooter className="border-t border-border px-5 py-4">
            <DialogClose
              render={
                <Button type="button" variant="outline" />
              }
            >
              Cancel
            </DialogClose>
            <Button type="submit" disabled={pending}>
              {pending ? (
                <Loader2 aria-hidden className="size-4 animate-spin" />
              ) : null}
              {pending ? "Sending…" : "Confirm Booking"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
