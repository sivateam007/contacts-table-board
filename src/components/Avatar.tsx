import { initials, paletteFor } from '../lib/format';

const SIZES = {
  xs: 'h-5 w-5 text-[9px]',
  sm: 'h-7 w-7 text-[11px]',
  md: 'h-10 w-10 text-sm',
} as const;

interface Props {
  name: string;
  size?: keyof typeof SIZES;
}

export function Avatar({ name, size = 'sm' }: Props) {
  return (
    <span
      aria-hidden="true"
      className={`grid shrink-0 place-items-center rounded-full font-semibold tracking-tight ${SIZES[size]} ${paletteFor(name)}`}
    >
      {initials(name)}
    </span>
  );
}
