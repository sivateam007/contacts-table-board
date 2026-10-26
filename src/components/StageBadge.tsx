import type { Stage } from '../types';
import { STAGE_META } from '../lib/stages';

interface Props {
  stage: Stage;
  size?: 'sm' | 'md';
}

export function StageBadge({ stage, size = 'sm' }: Props) {
  const padding = size === 'md' ? 'px-2.5 py-1 text-sm' : 'px-2 py-0.5 text-xs';
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ring-1 ring-inset ${padding} ${STAGE_META[stage].chip}`}
    >
      <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${STAGE_META[stage].dot}`} />
      {stage}
    </span>
  );
}
