import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const Home          = lazy(() => import('./pages/Home'));
const Books         = lazy(() => import('./pages/Books'));
const Learn         = lazy(() => import('./pages/Learn'));
const Dictionary    = lazy(() => import('./pages/Dictionary'));
const SignIn        = lazy(() => import('./pages/SignIn'));
const SignUp        = lazy(() => import('./pages/SignUp'));
const Contact       = lazy(() => import('./pages/Contact'));
const About         = lazy(() => import('./pages/About'));
const LessonDetail  = lazy(() => import('./pages/LessonDetail'));
const BookReader    = lazy(() => import('./pages/BookReader'));
const Leaders       = lazy(() => import('./pages/Leaders'));
const LeaderDetail  = lazy(() => import('./pages/LeaderDetail'));

// Admin shell — only loads if a user actually navigates to the admin path,
// so non-admin visitors never download the CMS bundle.
const AdminShell    = lazy(() => import('./admin/AdminShell'));

const ADMIN_PATH = (import.meta.env.VITE_ADMIN_PATH || 'pashto-hub').replace(/^\/+/, '');

const PageFallback = () => (
  <div className="flex items-center justify-center min-h-[60vh]" role="status" aria-live="polite">
    <div className="w-10 h-10 border-4 rounded-full border-primary-200 border-t-primary-600 animate-spin" />
    <span className="sr-only">Loading…</span>
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <Router>
          <Suspense fallback={<PageFallback />}>
            <Routes>

              {/* ── Admin CMS — full screen, no public Navbar/Footer ── */}
              <Route path={`/${ADMIN_PATH}/*`} element={<AdminShell />} />

              {/* ── Book Reader — full screen, no Navbar/Footer ── */}
              <Route path="/books/read" element={<BookReader />} />

              {/* ── All other pages — with Navbar + Footer ── */}
              <Route
                path="*"
                element={
                  <div className="flex flex-col min-h-screen text-gray-900 transition-colors duration-300 bg-white dark:bg-gray-900 dark:text-gray-100">
                    <Navbar />
                    <main className="flex-grow">
                      <Suspense fallback={<PageFallback />}>
                        <Routes>
                          <Route path="/" element={<Home />} />
                          <Route path="/books" element={<Books />} />
                          <Route path="/learn" element={<Learn />} />
                          <Route path="/learn/:slug" element={<LessonDetail />} />
                          <Route path="/dictionary" element={<Dictionary />} />
                          <Route path="/signin" element={<SignIn />} />
                          <Route path="/signup" element={<SignUp />} />
                          <Route path="/contact" element={<Contact />} />
                          <Route path="/about" element={<About />} />
                          <Route path="/leaders" element={<Leaders />} />
                          <Route path="/leaders/:id" element={<LeaderDetail />} />
                          <Route path="*" element={<Home />} />
                        </Routes>
                      </Suspense>
                    </main>
                    <Footer />
                  </div>
                }
              />
            </Routes>
          </Suspense>
        </Router>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
