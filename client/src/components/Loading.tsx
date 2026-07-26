interface LoadingProps {
  label?: string;
}

export default function Loading({ label = "Loading gallery" }: LoadingProps) {
  return (
    <div className="loading" role="status" aria-live="polite">
      <span className="loading__spinner" aria-hidden="true" />
      <span>{label}…</span>
    </div>
  );
}
