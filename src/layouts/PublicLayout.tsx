import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import Footer from '../components/Footer';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Events', href: '/events' },
  { name: 'Research', href: '/research' },
  { name: 'Resources', href: '/resources' },
  { name: 'Gallery', href: '/gallery' },
].map(item => ({
  ...item,
  current: false
}));

export default function PublicLayout() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        isHomePage ? 'bg-transparent' : 'bg-white shadow-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className={`text-2xl font-bold ${
                  isHomePage ? 'text-white' : 'text-indigo-600'
                }`}>WIHL</span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`inline-flex items-center px-3 py-2 text-sm font-medium transition-colors duration-300 ${
                        isHomePage
                          ? 'text-white hover:text-white/80'
                          : isActive
                          ? 'text-[#00205b]'
                          : 'text-gray-700 hover:text-[#00205b]'
                      }`}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center">
              <Link
                to="/contact"
                className={`inline-flex items-center px-4 py-2 border ${
                  isHomePage
                    ? 'border-white text-white hover:bg-white hover:text-primary-DEFAULT'
                    : 'border-primary-DEFAULT text-primary-DEFAULT hover:bg-primary-DEFAULT hover:text-white'
                } text-sm font-medium transition-colors duration-300 border-none`}
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main className="pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}