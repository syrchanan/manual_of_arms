import { NavLink } from 'react-router-dom';

export default function TopNav() {
  return (
    <nav className="top-nav">
      <NavLink to="/" className="top-nav__logo" style={{ textDecoration: 'none' }}>
        Casey's <span>Infantry Tactics</span>
      </NavLink>
      <div className="top-nav__links">
        <NavLink to="/school-of-the-company" className={({ isActive }) => isActive ? 'active' : ''}>
          School of the Company
        </NavLink>
        <NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''}>
          About
        </NavLink>
      </div>
    </nav>
  );
}
