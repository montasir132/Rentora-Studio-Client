const blades = [0, 60, 120, 180, 240, 300];

export default function ApertureIcon({
  size = 48,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="-28 -28 56 56"
      aria-hidden="true"
      className={className}
    >
      <circle r="28" className="fill-primary" />
      <g className="stroke-background" strokeWidth="2.5" strokeLinecap="round" fill="none">
        {blades.map((a) => (
          <line key={a} x1="11" y1="0" x2="21.4" y2="-18.04" transform={`rotate(${a})`} />
        ))}
      </g>
      <polygon
        points="11,0 5.5,9.53 -5.5,9.53 -11,0 -5.5,-9.53 5.5,-9.53"
        className="fill-background"
      />
    </svg>
  );
}