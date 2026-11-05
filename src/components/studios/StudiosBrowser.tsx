"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  RotateCcw,
  Search,
  SlidersHorizontal,
  TriangleAlert,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import StudiosCard from "@/components/studios/StudiosCard";
import { studioCategories } from "@/lib/nav";
import type { Studio } from "@/lib/studiostype";
import { cn } from "cn";

export type Filters = {
  location: string;
  /** Category slug, or "" for all categories. */
  category: string;
  minPrice: string;
  maxPrice: string;
  maxCapacity: string;
  amenities: string[];
};

const EMPTY_FILTERS: Filters = {
  location: "",
  category: "",
  minPrice: "",
  maxPrice: "",
  maxCapacity: "",
  amenities: [],
};

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Lowest Price" },
  { value: "price-desc", label: "Highest Price" },
  { value: "rating-desc", label: "Highest Rated" },
] as const;

type SortValue = (typeof SORT_OPTIONS)[number]["value"];

function toNumber(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
}

/** Newest first: createdAt when present, otherwise the ObjectId timestamp. */
function createdKey(studio: Studio): number {
  if (studio.createdAt) {
    const parsed = Date.parse(studio.createdAt);
    if (Number.isFinite(parsed)) return parsed;
  }
  const oidSeconds = Number.parseInt(studio._id.slice(0, 8), 16);
  return Number.isFinite(oidSeconds) ? oidSeconds * 1000 : 0;
}

function countActive(filters: Filters): number {
  let count = 0;
  if (filters.location.trim()) count++;
  if (filters.category) count++;
  if (filters.minPrice.trim()) count++;
  if (filters.maxPrice.trim()) count++;
  if (filters.maxCapacity.trim()) count++;
  if (filters.amenities.length > 0) count++;
  return count;
}

type FilterPanelProps = {
  draft: Filters;
  amenityOptions: string[];
  onChange: (next: Filters) => void;
  onApply: () => void;
  onClear: () => void;
};

/** The filter form itself — rendered inside the desktop toolbar and the mobile Sheet. */
function FilterPanel({
  draft,
  amenityOptions,
  onChange,
  onApply,
  onClear,
}: FilterPanelProps) {
  const set = <K extends keyof Filters>(key: K, value: Filters[K]) =>
    onChange({ ...draft, [key]: value });

  const toggleAmenity = (item: string) =>
    set(
      "amenities",
      draft.amenities.includes(item)
        ? draft.amenities.filter((a) => a !== item)
        : [...draft.amenities, item]
    );

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onApply();
      }}
      className="flex flex-col gap-4"
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-1.5 sm:col-span-2 lg:col-span-1">
          <Label htmlFor="filter-location" className="text-sm">
            Location
          </Label>
          <Input
            id="filter-location"
            placeholder="City, area or address"
            value={draft.location}
            onChange={(event) => set("location", event.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="filter-category" className="text-sm">
            Studio Category
          </Label>
          <Select
            value={draft.category || "all"}
            onValueChange={(value) =>
              set("category", value === "all" ? "" : String(value ?? ""))
            }
          >
            <SelectTrigger id="filter-category" className="w-full">
              <SelectValue>
                {(value: string | null) =>
                  studioCategories.find((category) => category.slug === value)?.label ??
                  "All categories"
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {studioCategories.map((category) => (
                <SelectItem key={category.slug} value={category.slug}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="filter-min-price" className="text-sm">
            Minimum Price
          </Label>
          <Input
            id="filter-min-price"
            type="number"
            inputMode="numeric"
            min={0}
            step={1}
            placeholder="$ / hr"
            value={draft.minPrice}
            onChange={(event) => set("minPrice", event.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="filter-max-price" className="text-sm">
            Maximum Price
          </Label>
          <Input
            id="filter-max-price"
            type="number"
            inputMode="numeric"
            min={0}
            step={1}
            placeholder="$ / hr"
            value={draft.maxPrice}
            onChange={(event) => set("maxPrice", event.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="filter-capacity" className="text-sm">
            Maximum Capacity
          </Label>
          <Input
            id="filter-capacity"
            type="number"
            inputMode="numeric"
            min={1}
            step={1}
            placeholder="Guests"
            value={draft.maxCapacity}
            onChange={(event) => set("maxCapacity", event.target.value)}
          />
        </div>
      </div>

      {amenityOptions.length > 0 ? (
        <fieldset className="space-y-2">
          <legend className="text-sm font-medium">Amenities</legend>
          <div className="flex flex-wrap gap-2">
            {amenityOptions.map((item) => {
              const selected = draft.amenities.includes(item);
              return (
                <button
                  key={item}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => toggleAmenity(item)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                    selected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-foreground hover:bg-muted"
                  )}
                >
                  {selected ? <Check aria-hidden className="size-3.5" /> : null}
                  {item}
                </button>
              );
            })}
          </div>
        </fieldset>
      ) : null}

      <div className="flex items-center justify-between gap-2 border-t border-border pt-3">
        <Button type="button" variant="ghost" onClick={onClear}>
          Clear Filters
        </Button>
        <Button type="submit">Apply Filters</Button>
      </div>
    </form>
  );
}

type StudiosBrowserProps = {
  studios: Studio[];
  /** Category preselected via `/studios?category=...` links. */
  initialCategory?: string;
  /** True when the studios API failed (distinct from an empty result). */
  failed: boolean;
};

/**
 * Client-side discovery over the real API data: draft filters are applied
 * with "Apply Filters", sorting and results update live. The API returns the
 * full collection (no query parameters), so filtering happens here — nothing
 * is faked and no new endpoints are used.
 */
export default function StudiosBrowser({
  studios,
  initialCategory,
  failed,
}: StudiosBrowserProps) {
  const router = useRouter();
  const validCategory =
    initialCategory && studioCategories.some((c) => c.slug === initialCategory)
      ? initialCategory
      : "";
  const starting: Filters = { ...EMPTY_FILTERS, category: validCategory };

  const [draft, setDraft] = useState<Filters>(starting);
  const [applied, setApplied] = useState<Filters>(starting);
  const [sort, setSort] = useState<SortValue>("newest");

  const amenityOptions = useMemo(
    () =>
      Array.from(new Set(studios.flatMap((s) => s.amenities ?? []))).sort((a, b) =>
        a.localeCompare(b)
      ),
    [studios]
  );

  const filtered = useMemo(() => {
    const query = applied.location.trim().toLowerCase();
    const min = toNumber(applied.minPrice);
    const max = toNumber(applied.maxPrice);
    const capacity = toNumber(applied.maxCapacity);

    return studios.filter((studio) => {
      if (applied.category && studio.category !== applied.category) return false;
      if (query && !studio.location.toLowerCase().includes(query)) return false;
      if (min !== null && studio.hourlyRate < min) return false;
      if (max !== null && studio.hourlyRate > max) return false;
      if (capacity !== null && studio.capacity > capacity) return false;
      if (applied.amenities.length > 0) {
        const own = (studio.amenities ?? []).map((a) => a.toLowerCase());
        const wantsAll = applied.amenities.every((a) => own.includes(a.toLowerCase()));
        if (!wantsAll) return false;
      }
      return true;
    });
  }, [studios, applied]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    switch (sort) {
      case "price-asc":
        arr.sort((a, b) => (a.hourlyRate ?? 0) - (b.hourlyRate ?? 0));
        break;
      case "price-desc":
        arr.sort((a, b) => (b.hourlyRate ?? 0) - (a.hourlyRate ?? 0));
        break;
      case "rating-desc":
        arr.sort((a, b) => (b.rating ?? -1) - (a.rating ?? -1));
        break;
      default:
        arr.sort((a, b) => createdKey(b) - createdKey(a) || a.title.localeCompare(b.title));
    }
    return arr;
  }, [filtered, sort]);

  const activeCount = countActive(applied);

  const applyFilters = () => setApplied({ ...draft });
  const clearFilters = () => {
    setDraft(EMPTY_FILTERS);
    setApplied(EMPTY_FILTERS);
  };

  const panel = (
    <FilterPanel
      draft={draft}
      amenityOptions={amenityOptions}
      onChange={setDraft}
      onApply={applyFilters}
      onClear={clearFilters}
    />
  );

  if (failed) {
    return (
      <div className="mt-8 flex flex-col items-center gap-3 rounded-xl border border-border bg-card px-6 py-14 text-center">
        <span className="grid size-12 place-items-center rounded-full bg-destructive/10 text-destructive">
          <TriangleAlert aria-hidden className="size-6" />
        </span>
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold text-foreground">
            We couldn&apos;t load the studios
          </h2>
          <p className="max-w-md text-sm text-muted-foreground">
            Something went wrong while reaching the studios API. Check your
            connection and try again.
          </p>
        </div>
        <Button className="mt-1 gap-2" onClick={() => router.refresh()}>
          <RotateCcw aria-hidden className="size-4" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-6">
      {/* Desktop filter toolbar */}
      <div className="hidden rounded-xl border border-border bg-card p-4 sm:p-5 md:block">
        {panel}
      </div>

      {/* Mobile filter trigger */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger
            render={
              <Button variant="outline" className="w-full gap-2" />
            }
          >
            <SlidersHorizontal aria-hidden className="size-4" />
            Filters
            {activeCount > 0 ? (
              <Badge className="ml-1 rounded-full">{activeCount}</Badge>
            ) : null}
          </SheetTrigger>
          <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Filter Studios</SheetTitle>
            </SheetHeader>
            <div className="px-5 pb-8">{panel}</div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Results header */}
      <div className="mt-6 mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-semibold text-foreground">{sorted.length}</span> of{" "}
          <span className="font-semibold text-foreground">{studios.length}</span> studios
          {activeCount > 0 ? ` · ${activeCount} filter${activeCount === 1 ? "" : "s"} active` : ""}
        </p>

        <div className="flex items-center gap-2">
          <Label htmlFor="studios-sort" className="hidden text-sm text-muted-foreground sm:inline">
            Sort by
          </Label>
          <Select
            value={sort}
            onValueChange={(value) => setSort((value as SortValue) ?? "newest")}
          >
            <SelectTrigger id="studios-sort" size="sm" className="w-44">
              <SelectValue>
                {(value: string | null) =>
                  SORT_OPTIONS.find((option) => option.value === value)?.label ?? "Newest"
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Grid */}
      {sorted.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((studio) => (
            <StudiosCard key={studio._id} studio={studio} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Search}
          title="No Creative Spaces Found"
          description="We couldn't find any studios matching your search. Try changing your filters or exploring another location."
          action={{ label: "Clear Filters", onAction: clearFilters }}
        />
      )}
    </div>
  );
}
