import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { NAV_TREE, BATTALION_NAV_TREE } from '../../data/navigation.js';

const SECTIONS = [
  { label: 'School of the Company', tree: NAV_TREE, defaultOpen: 'lesson-iii' },
  { label: 'School of the Battalion', tree: BATTALION_NAV_TREE, defaultOpen: 'part-i' },
];

export default function Sidebar() {
  const location = useLocation();

  // Auto-expand the lesson/part containing the current page
  const initialOpen = () => {
    const set = new Set();
    SECTIONS.forEach(({ tree, defaultOpen }) => {
      let matched = false;
      tree.forEach((group) => {
        if (group.articles.some((a) => location.pathname === a.path)) {
          set.add(group.id);
          matched = true;
        }
      });
      if (!matched) set.add(defaultOpen);
    });
    return set;
  };

  const [openGroups, setOpenGroups] = useState(initialOpen);

  function toggleGroup(id) {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <aside className="sidebar">
      {SECTIONS.map(({ label, tree }) => (
        <div key={label} className="sidebar__section">
          <div className="sidebar__section-label">{label}</div>
          {tree.map((group) => {
            const isOpen = openGroups.has(group.id);
            return (
              <div key={group.id} className="sidebar__lesson">
                <button
                  className={`sidebar__lesson-header${isOpen ? ' open' : ''}`}
                  onClick={() => toggleGroup(group.id)}
                  aria-expanded={isOpen}
                >
                  {group.label}
                  <span className={`sidebar__chevron${isOpen ? ' open' : ''}`}>›</span>
                </button>
                {isOpen && (
                  <div className="sidebar__articles">
                    {group.articles.map((art) => (
                      <NavLink
                        key={art.id}
                        to={art.path}
                        className={({ isActive }) =>
                          `sidebar__article-link${isActive ? ' active' : ''}`
                        }
                      >
                        {art.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </aside>
  );
}
