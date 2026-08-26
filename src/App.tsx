import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import PageTransition from './components/PageTransition';
import Home from './pages/Home';
import Gallery from './pages/Gallery';

// Lazy-load every secondary route. Home + Gallery stay eager so the front door
// (whichever mode the deploy is in) renders without a network round-trip.
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const Pricing = lazy(() => import('./pages/Pricing'));
const Quote = lazy(() => import('./pages/Quote'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const Team = lazy(() => import('./pages/Team'));
const CaseStudies = lazy(() => import('./pages/CaseStudies'));
const Contact = lazy(() => import('./pages/Contact'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const Accessibility = lazy(() => import('./pages/Accessibility'));
const Studio = lazy(() => import('./pages/Studio'));
const Share = lazy(() => import('./pages/Share'));
const NotFound = lazy(() => import('./pages/NotFound'));

const TEMPLATE_MODE = import.meta.env.VITE_TEMPLATE_MODE === 'gallery';
const RootRoute = TEMPLATE_MODE ? Gallery : Home;

function RouteLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center" aria-live="polite" aria-busy="true">
      <div className="h-8 w-8 rounded-full border-2 border-accent border-t-transparent animate-spin" aria-label="Loading page" />
    </div>
  );
}

export default function App() {
  return (
    <Layout>
      <ScrollToTop />
      <PageTransition>
        <Suspense fallback={<RouteLoader />}>
          <Routes>
            <Route path="/"              element={<RootRoute />} />
            <Route path="/gallery"       element={<Gallery />} />
            <Route path="/studio"        element={<Studio />} />
            <Route path="/about"         element={<About />} />
            <Route path="/services"      element={<Services />} />
            <Route path="/pricing"       element={<Pricing />} />
            <Route path="/quote"         element={<Quote />} />
            <Route path="/faq"           element={<FAQ />} />
            <Route path="/blog"          element={<Blog />} />
            <Route path="/blog/:slug"    element={<BlogPost />} />
            <Route path="/team"          element={<Team />} />
            <Route path="/case-studies"  element={<CaseStudies />} />
            <Route path="/case-studies/:slug" element={<BlogPost />} />
            <Route path="/contact"       element={<Contact />} />
            <Route path="/share"         element={<Share />} />
            <Route path="/privacy"       element={<Privacy />} />
            <Route path="/terms"         element={<Terms />} />
            <Route path="/accessibility" element={<Accessibility />} />
            <Route path="*"              element={<NotFound />} />
          </Routes>
        </Suspense>
      </PageTransition>
    </Layout>
  );
}
