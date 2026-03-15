export default function CanvasToggles({ showLabels, showGrid, showFileClosers, showAnnotations, onChange }) {
  const toggles = [
    { key: 'showLabels',      label: '🏷',  title: 'Role labels',       value: showLabels      },
    { key: 'showGrid',        label: '⊞',  title: 'Pace grid',          value: showGrid        },
    { key: 'showFileClosers', label: '⬛', title: 'File closers',       value: showFileClosers },
    { key: 'showAnnotations', label: 'ℹ',  title: 'Annotations',        value: showAnnotations },
  ];

  return (
    <div className="canvas-toggles" role="group" aria-label="Canvas display options">
      {toggles.map(({ key, label, title, value }) => (
        <button
          key={key}
          className={`canvas-toggle-btn${value ? ' active' : ''}`}
          onClick={() => onChange(key, !value)}
          title={`${value ? 'Hide' : 'Show'} ${title}`}
          aria-pressed={value}
          aria-label={`${value ? 'Hide' : 'Show'} ${title}`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
