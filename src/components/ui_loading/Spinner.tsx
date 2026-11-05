import ApertureIcon from "./ApertureIcon";

export default function Spinner({ label = "Loading..." }: { label?: string }) {
  return (
    <div
      role="status"
      className="flex min-h-[60vh] flex-col items-center justify-center gap-4"
    >
      <ApertureIcon size={56} className="animate-spin animation-duration-[2s]" />
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
    </div>
  );
}