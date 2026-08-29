export default function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-3 focus:rounded-lg focus:bg-[var(--color-accent)] focus:text-[var(--color-on-accent)] focus:font-bold focus:shadow-2xl"
    >
      Skip to main content
    </a>
  );
}
