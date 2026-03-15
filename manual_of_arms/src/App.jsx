import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import TopNav from './components/layout/TopNav.jsx';
import Sidebar from './components/layout/Sidebar.jsx';
import Footer from './components/layout/Footer.jsx';
import Landing from './components/pages/Landing.jsx';
import LessonOverview from './components/pages/LessonOverview.jsx';
import About from './components/pages/About.jsx';
import DrillPage from './components/drill/DrillPage.jsx';

export default function App() {
  return (
    <HashRouter>
      <div className="app-shell">
        <TopNav />
        <div className="body-layout">
          <Sidebar />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/about" element={<About />} />
            <Route
              path="/school-of-the-company"
              element={
                <main className="main-content" id="main">
                  <h1 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>
                    School of the Company
                  </h1>
                  <p style={{ color: 'var(--text-2)' }}>
                    Select a lesson from the sidebar, or start with{' '}
                    <a href="#/school-of-the-company/lesson-iii">
                      Lesson III — The March
                    </a>
                    .
                  </p>
                </main>
              }
            />
            <Route path="/school-of-the-company/:lessonId" element={<LessonOverview />} />
            <Route
              path="/school-of-the-company/:lessonId/:drillId"
              element={<DrillPage />}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </HashRouter>
  );
}
