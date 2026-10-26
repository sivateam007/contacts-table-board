import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent } from 'react';
import type { Contact, ContactDraft, Stage } from '../types';
import { STAGES } from '../lib/stages';
import { Avatar } from './Avatar';
import { LabelList } from './LabelList';
import { Missing } from './Missing';
import { StageBadge } from './StageBadge';

interface Props {
  contact: Contact;
  /** Discards the draft and closes the panel. */
  onCancel: () => void;
  /** Commits the draft to shared state, then closes the panel. */
  onSave: (draft: ContactDraft) => void;
}

const MAX_NOTES = 500;

function focusableWithin(root: HTMLElement): HTMLElement[] {
  const selector = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';
  return Array.from(root.querySelectorAll<HTMLElement>(selector)).filter(
    (el) => el.getClientRects().length > 0,
  );
}

function Field({
  label,
  children,
  span = false,
}: {
  label: string;
  children: React.ReactNode;
  span?: boolean;
}) {
  return (
    <div className={span ? 'col-span-2' : undefined}>
      <dt className="text-xs font-medium text-gray-400">{label}</dt>
      <dd className="mt-1 text-sm text-gray-800">{children}</dd>
    </div>
  );
}

/**
 * Shared details panel. Stage and Notes are the editable fields; everything
 * else is context. The draft lives here and only reaches shared state on Save,
 * so a cancel (button, Escape, backdrop) can never leave a half-edited record.
 */
export function DetailsPanel({ contact, onCancel, onSave }: Props) {
  const [stage, setStage] = useState<Stage>(contact.stage);
  const [notes, setNotes] = useState(contact.notes);
  const dialogRef = useRef<HTMLElement>(null);

  const hasChanges = stage !== contact.stage || notes !== contact.notes;

  useEffect(() => {
    dialogRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  function onKeyDown(event: ReactKeyboardEvent<HTMLElement>) {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      onCancel();
      return;
    }
    if (event.key !== 'Tab') return;

    const root = dialogRef.current;
    if (!root) return;
    const items = focusableWithin(root);
    if (items.length === 0) return;

    const first = items[0];
    const last = items[items.length - 1];
    const active = document.activeElement;

    if (event.shiftKey && (active === first || active === root)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  return (
    <div className="fixed inset-0 z-40">
      {/* Clicking the backdrop cancels: mousedown on the backdrop specifically,
          so a text selection that ends outside the panel can't dismiss it. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gray-900/30"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) onCancel();
        }}
      />

      <aside
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="details-title"
        tabIndex={-1}
        onKeyDown={onKeyDown}
        className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-white shadow-2xl outline-none"
      >
        <header className="flex items-start gap-3 border-b border-gray-100 px-6 py-5">
          <Avatar name={contact.name} size="md" />
          <div className="min-w-0 flex-1">
            <h2 id="details-title" className="truncate text-base font-semibold text-gray-900">
              {contact.name}
            </h2>
            <div className="mt-1 flex items-center gap-2">
              <StageBadge stage={contact.stage} />
              <span className="truncate text-xs text-gray-500">Owner: {contact.owner}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close details"
            className="-m-1.5 rounded-md p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
          >
            <svg viewBox="0 0 16 16" aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M4 4l8 8M12 4l-8 8" strokeLinecap="round" />
            </svg>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <dl className="grid grid-cols-2 gap-x-4 gap-y-4">
            <Field label="Email" span>
              {contact.email ? (
                <a href={`mailto:${contact.email}`} className="break-all text-blue-600 hover:underline">
                  {contact.email}
                </a>
              ) : (
                <Missing what="email" />
              )}
            </Field>
            <Field label="Company">{contact.company || <Missing what="company" />}</Field>
            <Field label="Role">{contact.role || <Missing what="role" />}</Field>
            <Field label="Owner">
              <span className="flex items-center gap-2">
                <Avatar name={contact.owner} size="xs" />
                {contact.owner}
              </span>
            </Field>
            <Field label="Labels">
              <LabelList labels={contact.labels} max={4} />
            </Field>
          </dl>

          <div className="mt-7 space-y-5">
            <div>
              <label htmlFor="details-stage" className="text-xs font-medium text-gray-500">
                Stage
              </label>
              <select
                id="details-stage"
                value={stage}
                onChange={(event) => setStage(event.target.value as Stage)}
                className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm transition hover:border-gray-400"
              >
                {STAGES.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {stage !== contact.stage && (
                <p className="mt-1.5 text-xs text-amber-700">
                  Saving moves this contact from {contact.stage} to {stage} in both views.
                </p>
              )}
            </div>

            <div>
              <div className="flex items-baseline justify-between gap-3">
                <label htmlFor="details-notes" className="text-xs font-medium text-gray-500">
                  Notes
                </label>
                <span className="text-xs tabular-nums text-gray-400">
                  {notes.length}/{MAX_NOTES}
                </span>
              </div>
              <textarea
                id="details-notes"
                rows={5}
                maxLength={MAX_NOTES}
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Add context for your team…"
                className="mt-1.5 w-full resize-y rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm transition placeholder:text-gray-400 hover:border-gray-400"
              />
            </div>
          </div>
        </div>

        <footer className="flex items-center justify-between gap-3 border-t border-gray-100 bg-gray-50/70 px-6 py-4">
          <p role="status" aria-live="polite" className="text-xs text-gray-500">
            {hasChanges ? 'Unsaved changes' : 'No changes yet'}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => onSave({ stage, notes })}
              disabled={!hasChanges}
              className="rounded-lg bg-gray-900 px-3.5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
            >
              Save changes
            </button>
          </div>
        </footer>
      </aside>
    </div>
  );
}
