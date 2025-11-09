export default function IconTrash({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M3 5h14" />
      <path d="M8 5V3h4v2" />
      <path d="M6 5l1 12h6l1-12" />
    </svg>
  );
}
