interface Props {
  /** What is missing, e.g. "email" -> screen readers hear "No email". */
  what: string;
}

/**
 * Placeholder for absent optional data. The em dash keeps the layout quiet;
 * the hidden text keeps it meaningful when read aloud.
 */
export function Missing({ what }: Props) {
  return (
    <span className="text-gray-300">
      <span className="sr-only">No {what}</span>
      <span aria-hidden="true">—</span>
    </span>
  );
}
