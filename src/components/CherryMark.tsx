export function CherryMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 44" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M20 4 C 22 10, 28 12, 30 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" className="text-leaf-deep" />
      <path d="M20 4 C 18 10, 12 12, 10 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" className="text-leaf-deep" />
      <path d="M30 8 C 33 8, 35 6, 36 4 C 33 5, 32 6, 30 8 Z" fill="currentColor" className="text-leaf" />
      <circle cx="14" cy="30" r="9" fill="currentColor" className="text-cherry" />
      <circle cx="26" cy="32" r="9" fill="currentColor" className="text-cherry-deep" />
      <circle cx="11" cy="27" r="2" fill="currentColor" className="text-cream" opacity="0.5" />
    </svg>
  );
}
