import { Missing } from './Missing';

interface Props {
  labels: string[];
  /** How many chips to show before collapsing into a "+n" overflow chip. */
  max?: number;
}

export function LabelList({ labels, max = 2 }: Props) {
  if (labels.length === 0) return <Missing what="labels" />;

  const visible = labels.slice(0, max);
  const overflow = labels.length - visible.length;

  return (
    <span className="flex flex-wrap items-center gap-1.5">
      {visible.map((label) => (
        <span
          key={label}
          className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-200/80"
        >
          {label}
        </span>
      ))}
      {overflow > 0 && (
        <span className="inline-flex items-center rounded-full px-1.5 py-0.5 text-xs font-medium text-gray-400">
          +{overflow}
        </span>
      )}
    </span>
  );
}
