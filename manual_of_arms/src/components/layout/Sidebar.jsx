import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { NAV_TREE } from '../../data/navigation.js';

export default function Sidebar() {
  const location = useLocation();

  // Auto-expand the lesson containing the current page
  const initialOpen = () => {
    const set = new Set();
    NAV_TREE.forEach((lesson) => {
      if (lesson.articles.some((a) => location.pathname === a.path)) {
        set.add(lesson.id);
      }
    });
    // Default: open lesson-iii
    if (!set.size) set.add('lesson-iii');
    return set;
  };

  const [openLessons, setOpenLessons] = useState(initialOpen);

  function toggleLesson(id) {
    setOpenLessons((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <aside className="sidebar">
      {NAV_TREE.map((lesson) => {
        const isOpen = openLessons.has(lesson.id);
        return (
          <div key={lesson.id} className="sidebar__lesson">
            <button
              className={`sidebar__lesson-header${isOpen ? ' open' : ''}`}
              onClick={() => toggleLesson(lesson.id)}
              aria-expanded={isOpen}
            >
              {lesson.label}
              <span className={`sidebar__chevron${isOpen ? ' open' : ''}`}>›</span>
            </button>
            {isOpen && (
              <div className="sidebar__articles">
                {lesson.articles.map((art) => (
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
    </aside>
  );
}
