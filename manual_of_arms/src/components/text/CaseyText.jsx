import { useEffect, useRef } from 'react';
import { getParagraph } from '../../data/caseyText/index.js';

/**
 * CaseyText
 *
 * Renders the Casey paragraph references with the active one highlighted.
 * In Phase 1, we show the paragraph numbers and a placeholder note.
 * Full paragraph text can be added to the drill data later.
 *
 * @param {number[]} paragraphs - Casey paragraph numbers for this drill
 * @param {string} activeRef - e.g. "¶36–37" — the caseyRef from the current keyframe
 */
export default function CaseyText({ paragraphs, activeRef }) {
  const panelRef = useRef(null);
  const activeRef_ = activeRef?.replace('¶', '');

  // Determine which paragraphs are "active" from the ref string
  function isActive(num) {
    if (!activeRef_) return false;
    const parts = activeRef_.split(/[–—-]/);
    const start = parseInt(parts[0]);
    const end = parts[1] ? parseInt(parts[1]) : start;
    return num >= start && num <= end;
  }

  // Scroll active paragraph into view within the panel only
  useEffect(() => {
    if (!panelRef.current) return;
    const active = panelRef.current.querySelector('.casey-paragraph.active');
    if (active) {
      const panel = panelRef.current;
      const panelTop = panel.scrollTop;
      const panelBottom = panelTop + panel.clientHeight;
      const elTop = active.offsetTop;
      const elBottom = elTop + active.offsetHeight;
      if (elTop < panelTop) {
        panel.scrollTo({ top: elTop, behavior: 'smooth' });
      } else if (elBottom > panelBottom) {
        panel.scrollTo({ top: elBottom - panel.clientHeight, behavior: 'smooth' });
      }
    }
  }, [activeRef]);

  if (!paragraphs?.length) return null;

  return (
    <div className="casey-text-panel" aria-label="Casey's text references">
      <div className="casey-text-panel__header">Casey's Text</div>
      <div className="casey-text-panel__body" ref={panelRef}>
        {paragraphs.map((num) => (
          <p
            key={num}
            className={`casey-paragraph${isActive(num) ? ' active' : ''}`}
            id={`para-${num}`}
          >
            <span className="casey-paragraph__num" aria-hidden="true">¶{num}.</span>
            {getParagraph(num) ? (
              <span>{getParagraph(num)}</span>
            ) : (
              <span style={{ color: 'var(--text-2)', fontSize: '0.85rem' }}>
                [Paragraph text from Casey's <em>Infantry Tactics</em>, S.C. ¶{num}. Full text to be added.]
              </span>
            )}
          </p>
        ))}
        <p style={{ fontSize: '0.8rem', color: 'var(--text-2)', marginTop: '0.75rem', borderTop: '1px solid var(--border)', paddingTop: '0.5rem' }}>
          Full paragraph text from Casey's <em>Infantry Tactics</em> (1862) will be transcribed here.
          Reference: <a href="https://archive.org/details/infantrytactics01case" target="_blank" rel="noreferrer">Archive.org ↗</a>
        </p>
      </div>
    </div>
  );
}
