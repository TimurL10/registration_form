// Spinner.jsx
export default function Spinner({ size = 24 }) {
  return (
    <div className="flex items-center justify-center">
      <svg
        className="animate-spin"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        aria-label="Загрузка…"
        role="status"
      >
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25" />
        <path d="M22 12a10 10 0 0 0-10-10" fill="none" stroke="currentColor" strokeWidth="4" />
      </svg>
    </div>
  );
}
