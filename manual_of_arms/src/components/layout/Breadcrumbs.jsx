import { Link } from 'react-router-dom';

export default function Breadcrumbs({ crumbs }) {
  // crumbs: [{ label, path }], last one is current (no link)
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      {crumbs.map((crumb, i) => (
        <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          {i > 0 && <span className="breadcrumbs__sep" aria-hidden="true">›</span>}
          {i < crumbs.length - 1 ? (
            <Link to={crumb.path}>{crumb.label}</Link>
          ) : (
            <span className="breadcrumbs__current" aria-current="page">{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
