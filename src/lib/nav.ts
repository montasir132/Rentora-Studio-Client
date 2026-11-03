export type NavLink = { href: string; label: string };

export const navLinks: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/studios", label: "Explore Studios" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About Us" },
];

export const studioCategories: NavLink[] = [
  { href: "/studios?category=photo-studios", label: "Photo Studios" },
  { href: "/studios?category=film-stages", label: "Film Stages" },
  { href: "/studios?category=podcast-rooms", label: "Podcast Rooms" },
  { href: "/studios?category=music-suites", label: "Music Suites" },
];

/** "/" only matches itself; every other route matches by prefix. */
export function isActivePath(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}
