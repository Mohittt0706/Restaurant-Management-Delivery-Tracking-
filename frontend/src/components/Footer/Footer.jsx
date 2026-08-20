import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook } from 'lucide-react';

const footerLinks = [
  { label: 'About', to: '/' },
  { label: 'Menu', to: '/menu' },
  { label: 'Login', to: '/login' },
  { label: 'Register', to: '/register' },
];

export default function Footer() {
  return (
    <footer className="bg-cult-charcoal border-t border-cult-bronze/20">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <span className="font-display text-3xl tracking-widest text-cult-cream">
              CULT
            </span>
            <p className="font-body text-sm text-cult-warmgray mt-3 leading-relaxed max-w-xs">
              Underground dining experience. Bold flavors, premium craft, no
              compromise.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-body text-xs tracking-widest uppercase text-cult-warmgray mb-4">
              Navigate
            </h4>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="font-body text-sm text-cult-warmgray hover:text-cult-cream transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-body text-xs tracking-widest uppercase text-cult-warmgray mb-4">
              Follow Us
            </h4>
            <div className="flex gap-4">
              <a href="#" className="text-cult-warmgray hover:text-cult-ember transition-colors duration-300">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-cult-warmgray hover:text-cult-ember transition-colors duration-300">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-cult-warmgray hover:text-cult-ember transition-colors duration-300">
                <Facebook size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 border-t border-cult-bronze/20">
          <p className="font-body text-xs text-cult-warmgray text-center">
            &copy; {new Date().getFullYear()} CULT Restaurant. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
