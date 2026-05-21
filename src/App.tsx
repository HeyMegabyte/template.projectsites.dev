import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import PageTransition from './components/PageTransition';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Pricing from './pages/Pricing';
import FAQ from './pages/FAQ';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Team from './pages/Team';
import CaseStudies from './pages/CaseStudies';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Accessibility from './pages/Accessibility';
import Gallery from './pages/Gallery';
import NotFound from './pages/NotFound';

/**
 * Should `/` redirect to `/gallery`?
 *
 * The template repo deploys to `template.projectsites.dev` where the gallery
 * IS the front door. For any other deployment (a real customer site), the
 * default `/` route shows the customer's customized Home.tsx.
 *
 * The decision is made at build time from `VITE_TEMPLATE_MODE=gallery`.
 * Set in `.github/workflows/deploy-template.yml` for the template deploy.
 */
const TEMPLATE_MODE = import.meta.env.VITE_TEMPLATE_MODE === 'gallery';
const RootRoute = TEMPLATE_MODE ? Gallery : Home;

export default function App() {
  return (
    <Layout>
      <ScrollToTop />
      <PageTransition>
        <Routes>
          <Route path="/"              element={<RootRoute />} />
          <Route path="/gallery"       element={<Gallery />} />
          <Route path="/about"         element={<About />} />
          <Route path="/services"      element={<Services />} />
          <Route path="/pricing"       element={<Pricing />} />
          <Route path="/faq"           element={<FAQ />} />
          <Route path="/blog"          element={<Blog />} />
          <Route path="/blog/:slug"    element={<BlogPost />} />
          <Route path="/team"          element={<Team />} />
          <Route path="/case-studies"  element={<CaseStudies />} />
          <Route path="/case-studies/:slug" element={<BlogPost />} />
          <Route path="/contact"       element={<Contact />} />
          <Route path="/privacy"       element={<Privacy />} />
          <Route path="/terms"         element={<Terms />} />
          <Route path="/accessibility" element={<Accessibility />} />
          <Route path="*"              element={<NotFound />} />
        </Routes>
      </PageTransition>
    </Layout>
  );
}
