import type { Stage } from '../types';

/** Fixed board order — the board always renders every stage, even when empty. */
export const STAGES: readonly Stage[] = ['Lead', 'Prospect', 'Qualified', 'Customer'];

export interface StageMeta {
  /** Classes for the small badge/pill used in the table and panel. */
  chip: string;
  /** Classes for the coloured dot used in board column headers. */
  dot: string;
}

export const STAGE_META: Record<Stage, StageMeta> = {
  Lead: {
    chip: 'bg-slate-100 text-slate-700 ring-slate-200/80',
    dot: 'bg-slate-400',
  },
  Prospect: {
    chip: 'bg-sky-100 text-sky-700 ring-sky-200/80',
    dot: 'bg-sky-500',
  },
  Qualified: {
    chip: 'bg-amber-100 text-amber-800 ring-amber-200/80',
    dot: 'bg-amber-500',
  },
  Customer: {
    chip: 'bg-emerald-100 text-emerald-700 ring-emerald-200/80',
    dot: 'bg-emerald-500',
  },
};
