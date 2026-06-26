import Link from 'next/link';
import { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-primary-700 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-bold flex items-center gap-2">
            🌿 HerbApp
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="hover:text-primary-200 transition">
              Home
            </Link>
            <Link href="/herbs" className="hover:text-primary-200 transition">
              Browse
            </Link>
            <Link href="/herbs/create" className="hover:text-primary-200 transition">
              Add Herb
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <nav className="md:hidden py-4 border-t border-primary-600">
            <div className="flex flex-col gap-4">
              <Link href="/" className="hover:text-primary-200 transition">
                Home
              </Link>
              <Link href="/herbs" className="hover:text-primary-200 transition">
                Browse
              </Link>
              <Link href="/herbs/create" className="hover:text-primary-200 transition">
                Add Herb
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}