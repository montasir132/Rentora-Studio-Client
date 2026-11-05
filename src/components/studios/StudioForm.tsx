"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "@/lib/auth-client";
import { isValidHttpUrl } from "@/lib/auth-utils";
import { studioCategories } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { getTokenFromClient } from "@/lib/getTokenFromClient";

export type StudioValues = {
  title: string;
  category: string;
  hourlyRate: string;
  securityDeposit: string;
  capacity: string;
  location: string;
  image: string;
  amenities: string[];
  description: string;
  rating: string;
};

type FieldErrors = Partial<Record<keyof StudioValues, string>>;

type StudioFormProps = {
  mode: "create" | "edit";
  /** Required in edit mode. */
  studioId?: string;
  initial?: Partial<StudioValues>;
};

const AMENITY_OPTIONS = [
  "Wi-Fi",
  "Air conditioning",
  "Natural light",
  "Cyc wall",
  "Green screen",
  "Soundproofing",
  "Lighting kit",
  "Backdrops",
  "Microphones",
  "Mixing console",
  "Makeup room",
  "Parking",
];

const categoryLabels: Record<string, string> = Object.fromEntries(
  studioCategories.map((category) => [category.slug, category.label])
);

const STUDIOS_API = process.env.NEXT_PUBLIC_ADD_STUDIO_API_URL;

const STUDIOS_EDIT_API = process.env.NEXT_PUBLIC_STUDIO_EDIT_API_URL;

export function StudioForm({ mode, studioId, initial }: StudioFormProps) {
  const router = useRouter();
  const { data: session, isPending: sessionPending } = useSession();
  const user = session?.user ?? null;

  const [values, setValues] = useState<StudioValues>({
    title: initial?.title ?? "",
    category: initial?.category ?? studioCategories[0].slug,
    hourlyRate: initial?.hourlyRate ?? "",
    securityDeposit: initial?.securityDeposit ?? "",
    capacity: initial?.capacity ?? "",
    location: initial?.location ?? "",
    image: initial?.image ?? "",
    amenities: initial?.amenities ?? [],
    description: initial?.description ?? "",
    rating: initial?.rating ?? "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const alertRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (formError) alertRef.current?.focus();
  }, [formError]);

  const setField = <K extends keyof StudioValues>(key: K, value: StudioValues[K]) => {
    setValues((previous) => ({ ...previous, [key]: value }));
    setErrors((previous) => {
      if (!previous[key]) return previous;
      const next = { ...previous };
      delete next[key];
      return next;
    });
  };

  const toggleAmenity = (item: string) => {
    setField(
      "amenities",
      values.amenities.includes(item)
        ? values.amenities.filter((a) => a !== item)
        : [...values.amenities, item]
    );
  };

  const validate = (): FieldErrors => {
    const next: FieldErrors = {};

    if (values.rating.trim()) {
      const rating = Number(values.rating);
      if (!Number.isFinite(rating) || rating < 0 || rating > 5)
        next.rating = "Enter a rating between 0 and 5.";
    }

    if (!values.title.trim()) next.title = "Studio title is required.";
    else if (values.title.trim().length > 100)
      next.title = "Title must be 100 characters or fewer.";

    if (!studioCategories.some((c) => c.slug === values.category))
      next.category = "Please choose a category.";

    const rate = Number(values.hourlyRate);
    if (!values.hourlyRate.trim()) next.hourlyRate = "Hourly rate is required.";
    else if (!Number.isFinite(rate) || rate <= 0)
      next.hourlyRate = "Enter a positive hourly rate.";
    else if (rate > 100_000) next.hourlyRate = "That hourly rate looks unrealistic.";

    const deposit = Number(values.securityDeposit);
    if (!values.securityDeposit.trim())
      next.securityDeposit = "Security deposit is required (enter 0 for none).";
    else if (!Number.isFinite(deposit) || deposit < 0)
      next.securityDeposit = "Enter 0 or a positive amount.";

    const capacity = Number(values.capacity);
    if (!values.capacity.trim()) next.capacity = "Max capacity is required.";
    else if (!Number.isInteger(capacity) || capacity < 1)
      next.capacity = "Enter a whole number of at least 1.";
    else if (capacity > 1000) next.capacity = "Capacity looks too high.";

    if (!values.location.trim()) next.location = "Location or address is required.";

    if (!values.image.trim()) next.image = "Add a cover image URL.";
    else if (!isValidHttpUrl(values.image))
      next.image = "Enter a valid URL starting with http:// or https://.";

    if (values.description.trim().length < 20)
      next.description = "Write at least 20 characters about your space.";
    else if (values.description.length > 1000)
      next.description = "Overview must be 1000 characters or fewer.";

    return next;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending) return;

    setFormError(null);
    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      toast.error("Please fix the highlighted fields.");
      return;
    }
    setErrors({});

    if (!user) {
      toast.error("Please log in to continue.");
      return;
    }
    if (!STUDIOS_API) {
      const message = "The studios API is not configured.";
      setFormError(message);
      toast.error(message);
      return;
    }
    if (mode === "edit" && !studioId) {
      toast.error("Missing studio id.");
      return;
    }
    if (mode === "edit" && !STUDIOS_EDIT_API) {
      const message = "The studios update API is not configured.";
      setFormError(message);
      toast.error(message);
      return;
    }

    const loadingId = toast.loading(
      mode === "create" ? "Creating your studio…" : "Saving your changes…"
    );
    setPending(true);
    const token = await getTokenFromClient();
    try {
      const response = await fetch(
        mode === "create" ? STUDIOS_API : `${STUDIOS_EDIT_API}/${studioId}`,
        {
          method: mode === "create" ? "POST" : "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" ,
          authorization: `Bearer ${token}`,
        },
          body: JSON.stringify({
            title: values.title.trim(),
            category: values.category,
            hourlyRate: Number(values.hourlyRate),
            securityDeposit: Number(values.securityDeposit),
            capacity: Number(values.capacity),
            location: values.location.trim(),
            image: values.image.trim(),
            amenities: values.amenities,
            description: values.description.trim(),
            ownerName: user.name,
            ownerEmail: user.email,
          }),
        }
      );

      const payload = (await response.json().catch(() => null)) as {
        message?: string;
        error?: string;
      } | null;

      if (!response.ok) {
        const message =
          payload?.message ?? payload?.error ?? "Something went wrong. Please try again.";
        setFormError(message);
        toast.error(message, { id: loadingId });
        return;
      }

      toast.success(
        mode === "create" ? "Studio created successfully." : "Studio updated successfully.",
        { id: loadingId }
      );
      // Edit returns to My Listings; create keeps its original destination.
      router.push(mode === "edit" ? "/my-listings" : "/studios");
      router.refresh();
    } catch {
      const message = "Can't reach the server. Check your connection and try again.";
      setFormError(message);
      toast.error(message, { id: loadingId });
    } finally {
      setPending(false);
    }
  };

  if (sessionPending) {
    return (
      <div role="status" className="flex min-h-[40vh] items-center justify-center">
        <Loader2 aria-hidden className="size-6 animate-spin text-primary" />
        <span className="sr-only">Loading your account…</span>
      </div>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          {mode === "create" ? "Studio details" : "Edit studio details"}
        </CardTitle>
        <CardDescription>
          {mode === "create"
            ? "Share your space with creators looking for studios like yours."
            : "Update the information shown on your listing."}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-5">
          {formError && (
            <div
              ref={alertRef}
              role="alert"
              tabIndex={-1}
              className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive outline-none"
            >
              {formError}
            </div>
          )}

          {/* Title */}
          <Field>
            <FieldLabel htmlFor="studio-title">Studio Title</FieldLabel>
            <Input
              id="studio-title"
              name="title"
              placeholder="e.g. Loft Photo Studio"
              value={values.title}
              onChange={(e) => setField("title", e.target.value)}
              aria-invalid={errors.title ? true : undefined}
              aria-describedby={errors.title ? "studio-title-error" : undefined}
            />
            {errors.title && <FieldError id="studio-title-error">{errors.title}</FieldError>}
          </Field>

          {/* Category + Capacity */}
          <div className="grid gap-5 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="studio-category">Category</FieldLabel>
              <Select
                value={values.category}
                onValueChange={(value) => setField("category", String(value ?? ""))}
              >
                <SelectTrigger id="studio-category" className="w-full">
                  <SelectValue placeholder="Choose a category">
                    {(value: string | null) =>
                      (value && categoryLabels[value]) || "Choose a category"
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {studioCategories.map((category) => (
                    <SelectItem key={category.slug} value={category.slug}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && <FieldError>{errors.category}</FieldError>}
            </Field>

            <Field>
              <FieldLabel htmlFor="studio-capacity">Max Capacity</FieldLabel>
              <Input
                id="studio-capacity"
                name="capacity"
                type="number"
                inputMode="numeric"
                min={1}
                step="1"
                placeholder="e.g. 12"
                value={values.capacity}
                onChange={(e) => setField("capacity", e.target.value)}
                aria-invalid={errors.capacity ? true : undefined}
                aria-describedby={errors.capacity ? "studio-capacity-error" : undefined}
              />
              {errors.capacity && (
                <FieldError id="studio-capacity-error">{errors.capacity}</FieldError>
              )}
              <FieldDescription>Maximum people allowed at once.</FieldDescription>
            </Field>
          </div>

          {/* Rate + Deposit */}
          <div className="grid gap-5 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="studio-rate">Hourly Rate (USD)</FieldLabel>
              <Input
                id="studio-rate"
                name="hourlyRate"
                type="number"
                inputMode="decimal"
                min={1}
                step="1"
                placeholder="e.g. 45"
                value={values.hourlyRate}
                onChange={(e) => setField("hourlyRate", e.target.value)}
                aria-invalid={errors.hourlyRate ? true : undefined}
                aria-describedby={errors.hourlyRate ? "studio-rate-error" : undefined}
              />
              {errors.hourlyRate && (
                <FieldError id="studio-rate-error">{errors.hourlyRate}</FieldError>
              )}
              <FieldDescription>Charged per hour of booking.</FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="studio-deposit">Security Deposit (USD)</FieldLabel>
              <Input
                id="studio-deposit"
                name="securityDeposit"
                type="number"
                inputMode="decimal"
                min={0}
                step="1"
                placeholder="e.g. 100"
                value={values.securityDeposit}
                onChange={(e) => setField("securityDeposit", e.target.value)}
                aria-invalid={errors.securityDeposit ? true : undefined}
                aria-describedby={errors.securityDeposit ? "studio-deposit-error" : undefined}
              />
              {errors.securityDeposit && (
                <FieldError id="studio-deposit-error">{errors.securityDeposit}</FieldError>
              )}
              <FieldDescription>Refundable, covers damage or missing gear.</FieldDescription>
            </Field>
          </div>

          {/* Location */}
          <Field>
            <FieldLabel htmlFor="studio-location">Location / Address</FieldLabel>
            <Input
              id="studio-location"
              name="location"
              placeholder="e.g. House 12, Road 5, Banani, Dhaka"
              value={values.location}
              onChange={(e) => setField("location", e.target.value)}
              aria-invalid={errors.location ? true : undefined}
              aria-describedby={errors.location ? "studio-location-error" : undefined}
            />
            {errors.location && (
              <FieldError id="studio-location-error">{errors.location}</FieldError>
            )}
          </Field>
          
          {/* Rating */}
          <Field>
            <FieldLabel htmlFor="studio-rating">
              Rating (0 to 5){" "}
              <span className="font-normal text-muted-foreground">(optional)</span>
            </FieldLabel>
            <Input
              id="studio-rating"
              name="rating"
              type="number"
              inputMode="decimal"
              min={0}
              max={5}
              step="0.1"
              placeholder="e.g. 4.5"
              value={values.rating}
              onChange={(e) => setField("rating", e.target.value)}
              aria-invalid={errors.rating ? true : undefined}
              aria-describedby={errors.rating ? "studio-rating-error" : undefined}
            />
            {errors.rating && <FieldError id="studio-rating-error">{errors.rating}</FieldError>}
          </Field>
          {/* Cover image URL */}
          <Field>
            <FieldLabel htmlFor="studio-image">Cover Image URL</FieldLabel>
            <Input
              id="studio-image"
              name="image"
              type="url"
              inputMode="url"
              placeholder="https://example.com/studio.jpg"
              value={values.image}
              onChange={(e) => setField("image", e.target.value)}
              aria-invalid={errors.image ? true : undefined}
              aria-describedby={errors.image ? "studio-image-error" : undefined}
            />
            {errors.image && <FieldError id="studio-image-error">{errors.image}</FieldError>}
            {values.image && isValidHttpUrl(values.image) && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={values.image}
                alt="Studio cover preview"
                className="mt-2 h-48 w-full rounded-lg border border-border object-cover"
              />
            )}
          </Field>

          {/* Amenities */}
          <Field>
            <FieldLabel>Amenities</FieldLabel>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Amenities">
              {AMENITY_OPTIONS.map((item) => {
                const selected = values.amenities.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => toggleAmenity(item)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                      selected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-foreground hover:bg-muted"
                    )}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
            <FieldDescription>
              {values.amenities.length} selected. Tap to add or remove.
            </FieldDescription>
          </Field>

          {/* Overview */}
          <Field>
            <FieldLabel htmlFor="studio-description">Detailed Overview</FieldLabel>
            <Textarea
              id="studio-description"
              name="description"
              rows={5}
              placeholder="Describe the space, equipment available, access hours and house rules."
              value={values.description}
              onChange={(e) => setField("description", e.target.value)}
              aria-invalid={errors.description ? true : undefined}
              aria-describedby={errors.description ? "studio-description-error" : undefined}
            />
            {errors.description && (
              <FieldError id="studio-description-error">{errors.description}</FieldError>
            )}
            <FieldDescription>{values.description.length} / 1000 characters</FieldDescription>
          </Field>

          {/* Read-only host info */}
          <div className="grid gap-5 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="owner-name">Host Name</FieldLabel>
              <Input id="owner-name" value={user?.name ?? ""} readOnly disabled />
            </Field>
            <Field>
              <FieldLabel htmlFor="owner-email">Host Email</FieldLabel>
              <Input id="owner-email" value={user?.email ?? ""} readOnly disabled />
            </Field>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button type="submit" size="lg" disabled={pending}>
              {pending ? (
                <>
                  <Loader2 aria-hidden className="size-4 animate-spin" />
                  {mode === "create" ? "Creating…" : "Saving…"}
                </>
              ) : mode === "create" ? (
                "Create Studio"
              ) : (
                "Save Changes"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              render={<Link href="/my-listings" />}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}