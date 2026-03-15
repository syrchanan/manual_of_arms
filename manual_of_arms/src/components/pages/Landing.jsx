import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <main className="main-content" id="main">
      <div className="landing">
        <div className="landing__hero">
          <h1>Casey's Infantry Tactics</h1>
          <p className="subtitle">
            An interactive animated reference for the <em>School of the Company</em> —
            Civil War drill made visible.
          </p>
          <Link to="/school-of-the-company/lesson-iii/march-in-line" className="landing__cta">
            Begin with Lesson III →
          </Link>
        </div>

        <div className="landing__section">
          <h2>Who was Casey?</h2>
          <p>
            Brigadier General Silas Casey (1807–1882) compiled <em>Infantry Tactics for the
            Instruction, Exercise, and Manoeuvres of the Soldier, a Company, Line of Skirmishers,
            Battalion, Brigade, or Corps d'Armée</em> (1862), which was adopted as the standard
            Union Army drill manual early in the Civil War. It builds on Scott's and Hardee's
            systems and is notable for its clarity and comprehensiveness.
          </p>
        </div>

        <div className="landing__section">
          <h2>What this site is</h2>
          <p>
            Each drill command in the <em>School of the Company</em> (Lessons III–VI) is presented
            with a precise top-down SVG animation showing all 47 individuals of a 20-file company
            maneuvering through the prescribed movements. Animations are synchronized with Casey's
            original paragraph text.
          </p>
          <p>
            Intended for Civil War reenactors, living historians, and students of 19th-century
            military history.
          </p>
        </div>

        <div className="landing__section">
          <h2>How to use the animations</h2>
          <p>
            Use <strong>▶ Play</strong> to watch the movement unfold, or step through keyframe
            by keyframe with the arrow buttons. Toggle labels, grid, and annotations using the
            buttons in the canvas corner. Keyboard: <kbd>Space</kbd> to play/pause,
            <kbd>←</kbd> / <kbd>→</kbd> to step, <kbd>1</kbd>–<kbd>3</kbd> to change speed.
          </p>
        </div>

        <div className="landing__section">
          <h2>Content</h2>
          <p>
            <Link to="/school-of-the-company/lesson-iii/march-in-line">Lesson III — The March</Link>:
            march in line, halt and align, oblique march, mark time / double quick / back step,
            march in retreat.
          </p>
          <p>
            <Link to="/school-of-the-company/lesson-iv/march-by-flank">Lesson IV — The Flank March</Link>:
            march by the flank, change direction by file, halt and face to front, form by file
            into line, form by company into line.
          </p>
          <p>
            <Link to="/school-of-the-company/lesson-v/break-into-column">Lesson V — Column of Platoons</Link> and{' '}
            <Link to="/school-of-the-company/lesson-vi/break-platoons">Lesson VI — Advanced Movements</Link>{' '}
            are in development.
          </p>
        </div>
      </div>
    </main>
  );
}
