import { Camera, Clapperboard, Mic, Guitar, Palette, type LucideIcon } from "lucide-react";

export type NavLink = { href: string; label: string };

export const navLinks: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/studios", label: "Explore Studios" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#about", label: "About Us" },
];

export type StudioCategory = {
  slug: string;
  label: string;
  description: string;
  icon: LucideIcon;
  href: string;
};

/**
 * Single source of truth for studio categories — consumed by the home
 * category cards, the footer links, and (later) the /studios filters.
 * The `href` pre-selects the category on the studios page.
 */
export const studioCategories: StudioCategory[] = [
  {
    slug: "photo-studios",
    label: "Photo Studios",
    description: "Daylight lofts, cyc walls and infinity coves for stills, fashion and product shoots.",
    icon: Camera,
    href: "/studios?category=photo-studios",
  },
  {
    slug: "sound-stages",
    label: "Sound Stages",
    description: "Sound-treated floors with grid ceilings for film, TV and commercial production.",
    icon: Clapperboard,
    href: "/studios?category=sound-stages",
  },
  {
    slug: "podcast-rooms",
    label: "Podcast Rooms",
    description: "Acoustically treated booths with broadcast-ready mics — plug in and press record.",
    icon: Mic,
    href: "/studios?category=podcast-rooms",
  },
  {
    slug: "music-suites",
    label: "Music Suites",
    description: "Tracking rooms, live rooms and control suites for rehearsals, recording and mixing.",
    icon: Guitar,
    href: "/studios?category=music-suites",
  },
  {
    slug: "art-workshops",
    label: "Art Workshops",
    description: "Bright, easy-to-clean studios for painting, ceramics and hands-on maker sessions.",
    icon: Palette,
    href: "/studios?category=art-workshops",
  },
];

/** "/" only matches itself; every other route matches by prefix. */
export function isActivePath(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}
