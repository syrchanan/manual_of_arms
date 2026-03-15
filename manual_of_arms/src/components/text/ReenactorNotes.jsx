import { useState } from 'react';

export default function ReenactorNotes({ notes }) {
  const [open, setOpen] = useState(false);
  if (!notes) return null;

  return (
    <div className="reenactor-notes">
      <button
        className="reenactor-notes__header"
        onClick={() => setOpen((p) => !p)}
        aria-expanded={open}
      >
        Reenactor Notes
        <span aria-hidden="true">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="reenactor-notes__body">
          {typeof notes === 'string' ? (
            <p>{notes}</p>
          ) : (
            notes
          )}
        </div>
      )}
    </div>
  );
}
