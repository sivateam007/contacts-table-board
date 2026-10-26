import { useEffect, useRef, useState } from 'react';
import type { Contact, ContactDraft, ViewMode } from './types';
import { CONTACTS } from './data/contacts';
import { STAGES } from './lib/stages';
import { ViewSwitch } from './components/ViewSwitch';
import { TableView } from './components/TableView';
import { BoardView } from './components/BoardView';
import { DetailsPanel } from './components/DetailsPanel';

/**
 * One `contacts` array is the single source of truth: the table, the board and
 * the details panel all read from it, and only Save writes to it. Switching
 * views is therefore a pure re-render — edits can't duplicate or go stale, and
 * the chosen view survives opening/closing a record.
 */
export default function App() {
  const [contacts, setContacts] = useState<Contact[]>(CONTACTS);
  const [view, setView] = useState<ViewMode>('table');
  const [openId, setOpenId] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState('');

  /** Set when a panel closes, so focus can return to the record that opened it. */
  const pendingFocusId = useRef<string | null>(null);
  const tablistRef = useRef<HTMLDivElement | null>(null);

  function openRecord(id: string) {
    setOpenId(id);
  }

  function closeRecord() {
    pendingFocusId.current = openId;
    setOpenId(null);
  }

  function saveRecord(id: string, draft: ContactDraft) {
    const previous = contacts.find((contact) => contact.id === id);
    setContacts((current) =>
      current.map((contact) => (contact.id === id ? { ...contact, ...draft } : contact)),
    );
    setAnnouncement(
      previous && previous.stage !== draft.stage
        ? `Saved. ${previous.name} moved to ${draft.stage}.`
        : `Saved changes to ${previous?.name ?? 'contact'}.`,
    );
    pendingFocusId.current = id;
    setOpenId(null);
  }

  function resetData() {
    setContacts(CONTACTS);
    setAnnouncement('Demo data reset.');
  }

  // After the panel unmounts, put focus back on the row/card that opened it.
  // A stage change can re-parent a board card into another column (new DOM
  // node), so we re-query by id instead of holding onto the old element.
  useEffect(() => {
    const id = pendingFocusId.current;
    if (openId !== null || id === null) return;
    pendingFocusId.current = null;

    const panel = document.getElementById(`viewpanel-${view}`);
    const opener = panel?.querySelector<HTMLElement>(`[data-focus-contact="${id}"]`);
    if (opener) opener.focus();
    else tablistRef.current?.focus();
  }, [openId, view]);

  const record = openId === null ? undefined : contacts.find((contact) => contact.id === openId);

  return (
    <div className="min-h-screen">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-x-4 gap-y-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gray-900 text-white"
            >
              <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M3 4.5h10M3 8h10M3 11.5h6" strokeLinecap="round" />
              </svg>
            </span>
            <div>
              <h1 className="text-sm font-semibold leading-5 text-gray-900">Contacts</h1>
              <p className="text-xs text-gray-500">
                {contacts.length} contacts · {STAGES.length} stages
              </p>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <button
              type="button"
              onClick={resetData}
              className="hidden text-xs font-medium text-gray-400 transition hover:text-gray-700 sm:block"
            >
              Reset demo data
            </button>
            <ViewSwitch value={view} onChange={setView} listRef={tablistRef} />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6">
        <div id="viewpanel-table" role="tabpanel" aria-labelledby="tab-table" tabIndex={-1} hidden={view !== 'table'}>
          <TableView contacts={contacts} onOpen={openRecord} />
        </div>
        <div id="viewpanel-board" role="tabpanel" aria-labelledby="tab-board" tabIndex={-1} hidden={view !== 'board'}>
          <BoardView contacts={contacts} onOpen={openRecord} />
        </div>
      </main>

      {record && (
        <DetailsPanel
          key={record.id}
          contact={record}
          onCancel={closeRecord}
          onSave={(draft) => saveRecord(record.id, draft)}
        />
      )}

      <div role="status" aria-live="polite" className="sr-only">
        {announcement}
      </div>
    </div>
  );
}
