import type { MouseEvent } from 'react';
import type { Contact } from '../types';
import { Avatar } from './Avatar';
import { LabelList } from './LabelList';
import { Missing } from './Missing';
import { StageBadge } from './StageBadge';

interface Props {
  contacts: Contact[];
  onOpen: (id: string) => void;
}

/**
 * Columns that only matter when there is room. Rather than scrolling at every
 * width, each field drops out at a breakpoint chosen so the remaining columns
 * still fit: all seven at >=1280, no role/labels at >=1024, no email at >=768,
 * no owner at >=640. Below that the table falls back to horizontal scroll
 * instead of squeezing every cell.
 */
const HEAD = 'px-3 py-2.5 text-left text-xs font-medium text-gray-500';

export function TableView({ contacts, onOpen }: Props) {
  function openFromRow(event: MouseEvent<HTMLTableRowElement>, id: string) {
    const opener = event.currentTarget.querySelector<HTMLElement>('[data-focus-contact]');
    if (opener) onOpen(id);
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="w-full min-w-[22rem] border-collapse text-left">
        <caption className="sr-only">
          All contacts with their email, company, role, owner, labels and stage. Select a name to open details.
        </caption>
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50/80">
            <th scope="col" className={`${HEAD} pl-4`}>
              Name
            </th>
            <th scope="col" className={`${HEAD} hidden lg:table-cell`}>
              Email
            </th>
            <th scope="col" className={HEAD}>
              Company
            </th>
            <th scope="col" className={`${HEAD} hidden xl:table-cell`}>
              Role
            </th>
            <th scope="col" className={`${HEAD} hidden md:table-cell`}>
              Owner
            </th>
            <th scope="col" className={`${HEAD} hidden xl:table-cell`}>
              Labels
            </th>
            <th scope="col" className={`${HEAD} pr-4`}>
              Stage
            </th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact) => (
            <tr
              key={contact.id}
              onClick={(event) => openFromRow(event, contact.id)}
              className="cursor-pointer border-b border-gray-100 transition-colors last:border-0 hover:bg-gray-50"
            >
              <td className="py-2 pl-4 pr-3">
                <button
                  type="button"
                  data-focus-contact={contact.id}
                  onClick={(event) => {
                    event.stopPropagation();
                    onOpen(contact.id);
                  }}
                  className="flex w-full items-center gap-3 rounded-md text-left"
                >
                  <Avatar name={contact.name} />
                  <span className="min-w-0 truncate text-sm font-medium text-gray-900">{contact.name}</span>
                </button>
              </td>
              <td className="hidden px-3 py-2.5 text-sm text-gray-600 lg:table-cell">
                {contact.email ? (
                  <span className="block max-w-[15rem] truncate">{contact.email}</span>
                ) : (
                  <Missing what="email" />
                )}
              </td>
              <td className="px-3 py-2.5 text-sm text-gray-700">
                {contact.company ? (
                  <span className="block max-w-[12rem] truncate">{contact.company}</span>
                ) : (
                  <Missing what="company" />
                )}
              </td>
              <td className="hidden px-3 py-2.5 text-sm text-gray-600 xl:table-cell">
                {contact.role ? (
                  <span className="block max-w-[12rem] truncate">{contact.role}</span>
                ) : (
                  <Missing what="role" />
                )}
              </td>
              <td className="hidden px-3 py-2.5 md:table-cell">
                <span className="flex items-center gap-2">
                  <Avatar name={contact.owner} size="xs" />
                  <span className="truncate text-sm text-gray-600">{contact.owner}</span>
                </span>
              </td>
              <td className="hidden px-3 py-2.5 xl:table-cell">
                <LabelList labels={contact.labels} />
              </td>
              <td className="py-2 pl-3 pr-4">
                <StageBadge stage={contact.stage} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
