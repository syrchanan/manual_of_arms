import Breadcrumbs from '../layout/Breadcrumbs.jsx';

export default function About() {
  return (
    <main className="main-content" id="main">
      <div className="about-page">
        <Breadcrumbs crumbs={[{ label: 'About', path: '#' }]} />
        <h1>About This Project</h1>

        <h2>Source</h2>
        <p>
          All drill content is based on <em>Infantry Tactics for the Instruction, Exercise, and
          Manoeuvres of the Soldier, a Company, Line of Skirmishers, Battalion, Brigade, or
          Corps d'Armée</em> by Silas Casey, Brevet Major General U.S. Army. Volume I: School of
          the Soldier and School of the Company. Published 1862, D. Van Nostrand, New York.
        </p>
        <p>
          A digitized copy is available at{' '}
          <a href="https://archive.org/details/infantrytactics01case" target="_blank" rel="noreferrer">
            Archive.org ↗
          </a>
          .
        </p>

        <h2>Accuracy</h2>
        <p>
          All movements are traceable to specific Casey's paragraphs. Distances and intervals
          follow Casey's specifications: 28-inch pace (quick time), 13-inch rank distance, 2-pace
          file closer interval. Terminology is Casey's throughout.
        </p>
        <p>
          When Casey is ambiguous, the most commonly accepted interpretation among experienced
          reenactors is presented, with a note in the Reenactor Notes section.
        </p>

        <h2>Phase 1 scope</h2>
        <p>
          This initial release covers the <em>School of the Company</em>, Lessons III–VI.
          Future phases will add the School of the Soldier (manual of arms) and the School of
          the Battalion.
        </p>

        <h2>Technical</h2>
        <p>
          Built with React (Vite), D3.js for SVG animation, and react-router-dom. Hosted on
          GitHub Pages. No backend — all drill data is embedded as JavaScript modules.
        </p>
      </div>
    </main>
  );
}
