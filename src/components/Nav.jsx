import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Nav() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const links = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/services', label: 'Services' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="fixed top-0 w-full bg-primary/95 backdrop-blur-md shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-white font-bold text-xl font-heading">Business Name</Link>
        <div className="hidden md:flex gap-6 items-center">
          {links.map(l => (
            <Link key={l.to} to={l.to} className={`text-sm font-semibold transition ${pathname === l.to ? 'text-white' : 'text-white/70 hover:text-white'}`}>
              {l.label}
            </Link>
          ))}
          <Link to="/contact" className="bg-accent hover:bg-accent/90 text-white font-bold text-sm px-5 py-2.5 rounded-lg transition">
            Get in Touch
          </Link>
        </div>
        <button className="md:hidden text-white" onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="md:hidden bg-primary border-t border-white/10 px-6 py-4 space-y-3">
          {links.map(l => (
            <Link key={l.to} to={l.to} className="block text-white/80 hover:text-white py-2" onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
