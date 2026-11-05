import Link from "next/link";
import { Home, Compass } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import ApertureIcon from "@/components/ui_loading/ApertureIcon";

export default function NotFound() {
    return (
        <section className="relative mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-4 py-16 text-center">
        {/* স্পটলাইটের আলো */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute top-0 h-72 w-72 rounded-full bg-accent/40 blur-3xl"
            />

            {/* 4 [aperture] 4 */}
            <div className="relative flex items-center justify-center gap-2 sm:gap-4">
                <span className="text-8xl font-bold leading-none text-primary sm:text-9xl">4</span>
                <ApertureIcon
                size={112}
                className="animate-[spin_14s_linear_infinite] sm:h-32 sm:w-32"
                />
                <span className="text-8xl font-bold leading-none text-primary sm:text-9xl">4</span>
            </div>

            {/* ক্ল্যাপারবোর্ড */}
            <div className="relative mt-8 w-64 -rotate-2 overflow-hidden rounded-md border-2 border-primary bg-card text-left shadow-md">
                <div className="flex h-5 -skew-x-12 bg-primary">
                {Array.from({ length: 8 }).map((_, i) => (
                    <span key={i} className={`h-full flex-1 ${i % 2 ? "bg-primary" : "bg-background"}`} />
                ))}
                </div>
                <div className="space-y-1 px-4 py-3 text-sm">
                <p><span className="font-semibold text-primary">Scene:</span> 404</p>
                <p><span className="font-semibold text-primary">Take:</span> Page not found</p>
                </div>
            </div>

            <h1 className="relative mt-8 text-2xl font-bold text-foreground sm:text-3xl">
                Cut! This scene is missing.
            </h1>
            <p className="relative mt-2 max-w-md text-muted-foreground">
                The page you are looking for has moved, been deleted, or never made it to the final cut.
            </p>

            <div className="relative mt-8 flex flex-wrap justify-center gap-3">
                <Link href="/" className={buttonVariants({ size: "lg" })}>
                <Home size={18} className="mr-2" /> Return to Home
                </Link>
                <Link href="/studios" className={buttonVariants({ size: "lg", variant: "outline" })}>
                <Compass size={18} className="mr-2" /> Explore Studios
                </Link>
            </div>
        </section>
    );
}