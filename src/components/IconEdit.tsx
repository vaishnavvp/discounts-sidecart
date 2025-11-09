export default function IconEdit({
  className = 'h-4 w-4 text-brand-teal cursor-pointer',
  onClick,
}: {
  className?: string;
  onClick?: () => void;
}) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
      onClick={onClick}
    >
      <path d="M3 14.25V17h2.75L14.81 7.94l-2.75-2.75L3 14.25z" />
      <path
        fill="currentColor"
        d="M17.71 6.04a.75.75 0 000-1.06l-2.35-2.35a.75.75 0 00-1.06 0L13 3.94l2.75 2.75 1.96-1.65z"
      />
    </svg>
  );
}
