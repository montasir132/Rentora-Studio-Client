import type { Metadata } from "next";
import { StudioForm } from "@/components/studios/StudioForm";

export const metadata: Metadata = {
  title: "Add New Studio | Rentora Studio",
  description: "List your creative space and reach creators looking for studios.",
};

export default function AddStudioPage() {
  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-primary sm:text-3xl">Add New Studio</h1>
        <p className="text-sm text-muted-foreground">
          List a creative space you own and reach creators looking for studios.
        </p>
      </div>

      <div className="mt-6">
        <StudioForm mode="create" />
      </div>
    </section>
  );
}