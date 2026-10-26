import { useMemo } from 'react';
import type { Contact } from '../types';
import { STAGES, STAGE_META } from '../lib/stages';
import { firstName } from '../lib/format';
import { Avatar } from './Avatar';
import { Missing } from './Missing';

interface Props {
  contacts: Contact[];
  onOpen: (id: string) => void;
}

function CardSubtitle({ contact }: { contact: Contact }) {
  const parts = [contact.company, contact.role].filter(Boolean);
  if (parts.length === 0) return <Missing what="company details" />;
  return <>{parts.join(' · ')}</>;
}

export function BoardView({ contacts, onOpen }: Props) {
  // Derived from the same array the table renders — one source of truth, so a
  // saved stage change lands in both views with no extra syncing.
  const columns = useMemo(
    () =>
      STAGES.map((stage) => ({
        stage,
        items: contacts.filter((contact) => contact.stage === stage),
      })),
    [contacts],
  );

  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {columns.map(({ stage, items }) => (
        <section
          key={stage}
          aria-label={`${stage} — ${items.length} contact${items.length === 1 ? '' : 's'}`}
          className="flex w-64 min-w-64 flex-1 flex-col"
        >
          <header className="mb-2.5 flex items-center gap-2 px-0.5">
            <span aria-hidden="true" className={`h-2 w-2 rounded-full ${STAGE_META[stage].dot}`} />
            <h3 className="text-sm font-semibold text-gray-800">{stage}</h3>
            <span className="rounded-full bg-gray-200/70 px-1.5 py-0.5 text-xs font-medium tabular-nums text-gray-600">
              {items.length}
            </span>
          </header>

          <div className="flex min-h-[14rem] flex-1 flex-col gap-2.5 rounded-xl bg-gray-100/70 p-2.5">
            {items.map((contact) => (
              <button
                key={contact.id}
                type="button"
                data-focus-contact={contact.id}
                onClick={() => onOpen(contact.id)}
                className="w-full rounded-lg border border-gray-200 bg-white p-3 text-left shadow-sm transition hover:border-gray-300 hover:shadow-md"
              >
                <span className="block truncate text-sm font-semibold text-gray-900">{contact.name}</span>
                <span className="mt-0.5 block truncate text-xs text-gray-500">
                  <CardSubtitle contact={contact} />
                </span>

                {contact.labels.length > 0 && (
                  <span className="mt-2.5 flex flex-wrap items-center gap-1.5">
                    {contact.labels.slice(0, 2).map((label) => (
                      <span
                        key={label}
                        className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600 ring-1 ring-inset ring-gray-200/80"
                      >
                        {label}
                      </span>
                    ))}
                    {contact.labels.length > 2 && (
                      <span className="text-[11px] font-medium text-gray-400">+{contact.labels.length - 2}</span>
                    )}
                  </span>
                )}

                <span className="mt-3 flex items-center justify-between gap-2">
                  <span className="flex min-w-0 items-center gap-1.5">
                    <Avatar name={contact.owner} size="xs" />
                    <span className="truncate text-[11px] text-gray-500">{firstName(contact.owner)}</span>
                  </span>
                  {!contact.email && <span className="shrink-0 text-[11px] font-medium text-amber-700">No email</span>}
                </span>
              </button>
            ))}

            {items.length === 0 && (
              <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-gray-300 px-4 py-8 text-center">
                <p className="text-xs leading-relaxed text-gray-400">
                  No contacts in <span className="font-medium text-gray-500">{stage}</span> yet
                </p>
              </div>
            )}
          </div>
        </section>
      ))}
    </div>
  );
}
