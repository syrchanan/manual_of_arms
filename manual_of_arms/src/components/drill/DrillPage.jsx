import { useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getDrill } from '../../data/drills/index.js';
import { NAV_TREE, getPrevNext } from '../../data/navigation.js';
import { useAnimationEngine } from '../../hooks/useAnimationEngine.js';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts.js';

import Breadcrumbs from '../layout/Breadcrumbs.jsx';
import DrillCanvas from './DrillCanvas.jsx';
import CanvasToggles from './CanvasToggles.jsx';
import Controls from './Controls.jsx';
import Legend from './Legend.jsx';
import CommandBlock from '../text/CommandBlock.jsx';
import CaseyText from '../text/CaseyText.jsx';
import ReenactorNotes from '../text/ReenactorNotes.jsx';

export default function DrillPage() {
  const { lessonId, drillId } = useParams();
  const drill = getDrill(drillId);

  const svgRef = useRef(null);
  const [speed, setSpeed] = useState(1);
  const [subMovement, setSubMovement] = useState(drill?.subMovements?.[0]?.id ?? null);
  const [toggles, setToggles] = useState({
    showLabels: false,
    showGrid: false,
    showFileClosers: true,
    showAnnotations: true,
  });

  const { play, pause, stepForward, stepBack, seekTo, currentIndex, isPlaying, keyframes } =
    useAnimationEngine(svgRef, drill, { speed, subMovement, ...toggles });

  useKeyboardShortcuts({ play, pause, stepForward, stepBack, setSpeed, isPlaying });

  function handleToggle(key, value) {
    setToggles((prev) => ({ ...prev, [key]: value }));
  }

  if (!drill) {
    return (
      <div className="main-content">
        <p style={{ color: 'var(--text-2)' }}>Drill not found: <code>{drillId}</code></p>
      </div>
    );
  }

  // Breadcrumbs
  const lesson = NAV_TREE.find((l) => l.id === lessonId);
  const crumbs = [
    { label: 'School of the Company', path: '/school-of-the-company' },
    { label: lesson?.label ?? lessonId, path: `/school-of-the-company/${lessonId}` },
    { label: drill.title, path: '#' },
  ];

  // Prev / Next
  const currentPath = `/school-of-the-company/${lessonId}/${drillId}`;
  const { prev, next } = getPrevNext(currentPath);

  // Active paragraphs from current keyframe
  const currentKf = keyframes[currentIndex];
  const activeRef = currentKf?.caseyRef ?? '';

  // Commands may vary by sub-movement (e.g. mark time vs double quick):
  // drills export either an array or a function of the selected sub-movement.
  const commands =
    typeof drill.commands === 'function' ? drill.commands(subMovement) : drill.commands;

  return (
    <main className="main-content" id="main">
      <Breadcrumbs crumbs={crumbs} />

      <h1 className="drill-page__title">{drill.title}</h1>
      <div className="drill-page__meta">
        Lesson {drill.lesson} · {drill.caseyParagraphs?.length ? `S.C. ¶${drill.caseyParagraphs[0]}–${drill.caseyParagraphs[drill.caseyParagraphs.length - 1]}` : ''}
      </div>

      {/* Commands */}
      {commands?.length > 0 && <CommandBlock commands={commands} />}

      {/* Sub-movement tabs */}
      {drill.subMovements && (
        <div className="sub-movement-tabs" role="tablist" aria-label="Sub-movements">
          {drill.subMovements.map((sm) => (
            <button
              key={sm.id}
              role="tab"
              aria-selected={subMovement === sm.id}
              className={`sub-movement-tab${subMovement === sm.id ? ' active' : ''}`}
              onClick={() => setSubMovement(sm.id)}
            >
              {sm.label}
            </button>
          ))}
        </div>
      )}

      {/* Canvas + toggles */}
      <div style={{ position: 'relative' }}>
        <DrillCanvas svgRef={svgRef} />
        <CanvasToggles {...toggles} onChange={handleToggle} />
      </div>

      {/* Controls */}
      <Controls
        isPlaying={isPlaying}
        play={play}
        pause={pause}
        stepForward={stepForward}
        stepBack={stepBack}
        speed={speed}
        setSpeed={setSpeed}
        currentIndex={currentIndex}
        keyframes={keyframes}
        seekTo={seekTo}
      />

      {/* Legend */}
      <Legend />

      {/* Casey's Text */}
      <CaseyText paragraphs={drill.caseyParagraphs ?? []} activeRef={activeRef} />

      {/* Reenactor Notes */}
      {drill.reenactorNotes && <ReenactorNotes notes={drill.reenactorNotes} />}

      {/* Prev / Next */}
      <nav className="prev-next" aria-label="Drill navigation">
        {prev ? (
          <Link to={prev.path}>← {prev.label}</Link>
        ) : (
          <span />
        )}
        <span className="prev-next__spacer" />
        {next ? (
          <Link to={next.path}>{next.label} →</Link>
        ) : (
          <span />
        )}
      </nav>
    </main>
  );
}
