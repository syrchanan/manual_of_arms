import { useParams, Link } from 'react-router-dom';
import { NAV_TREE } from '../../data/navigation.js';
import Breadcrumbs from '../layout/Breadcrumbs.jsx';

export default function LessonOverview() {
  const { lessonId } = useParams();
  const lesson = NAV_TREE.find((l) => l.id === lessonId);

  if (!lesson) {
    return (
      <main className="main-content">
        <p style={{ color: 'var(--text-2)' }}>Lesson not found: {lessonId}</p>
      </main>
    );
  }

  return (
    <main className="main-content" id="main">
      <Breadcrumbs crumbs={[
        { label: 'School of the Company', path: '/school-of-the-company' },
        { label: lesson.label, path: '#' },
      ]} />

      <h1 style={{ fontSize: '1.75rem', marginBottom: '1.25rem' }}>{lesson.label}</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {lesson.articles.map((art, i) => (
          <Link
            key={art.id}
            to={art.path}
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              border: '1px solid var(--border)',
              borderRadius: '6px',
              textDecoration: 'none',
              transition: 'border-color 0.15s, background 0.15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.background = 'rgba(37,99,235,0.03)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = ''; }}
          >
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-2)', minWidth: '2rem' }}>
              {i + 1}.
            </span>
            <span style={{ fontWeight: 500, color: 'var(--text-1)' }}>{art.label}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-2)', marginLeft: 'auto' }}>
              {art.caseyRef}
            </span>
          </Link>
        ))}
      </div>
    </main>
  );
}
