export default function StatusIndicator() {
  return (
    <div className="group relative flex items-center gap-1.5 text-xs text-[#16A34A]">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="h-3.5 w-3.5 animate-spin"
        aria-hidden="true"
      >
        <circle
          cx="12"
          cy="12"
          r="9"
          stroke="currentColor"
          strokeWidth="2"
          strokeOpacity="0.25"
        />
        <path
          d="M21 12a9 9 0 0 0-9-9"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <span>All systems operational</span>
      <div
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 mb-2 w-56 -translate-x-1/2 rounded-md border border-[#E4E7EC] bg-white px-3 py-2 text-center text-[11px] text-[#64748B] opacity-0 shadow-sm transition-opacity duration-150 group-hover:opacity-100"
      >
        We monitor this site continuously to keep it running smoothly.
      </div>
    </div>
  );
}