export function Navbar({ onBeginJourney }: { onBeginJourney: () => void }) {
  return (
    <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
      <span
        className="text-3xl tracking-tight text-hero-text"
        style={{ fontFamily: "var(--font-display)" }}
      >
        OmniMind<sup className="text-xs">®</sup>
      </span>

      <div className="hidden md:flex items-center gap-10" />

      <button
        onClick={onBeginJourney}
        className="liquid-glass rounded-full px-6 py-2.5 text-sm text-hero-text transition-transform hover:scale-[1.03] cursor-pointer"
      >
        Begin Journey
      </button>
    </nav>
  );
}