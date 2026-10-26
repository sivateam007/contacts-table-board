export type Stage = 'Lead' | 'Prospect' | 'Qualified' | 'Customer';

export type ViewMode = 'table' | 'board';

/**
 * A single contact record. Missing optional information is represented as an
 * empty string (or an empty labels array) and rendered as an em dash — the
 * absence of data is a first-class state, not an error.
 */
export interface Contact {
  id: string;
  name: string;
  email: string;
  company: string;
  role: string;
  owner: string;
  labels: string[];
  stage: Stage;
  notes: string;
}

/** The editable slice of a record — everything the details panel can change. */
export interface ContactDraft {
  stage: Stage;
  notes: string;
}
