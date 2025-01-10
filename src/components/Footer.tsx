import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, LogIn, MessageCircle } from 'lucide-react';

const navigation = {
  main: [
    { name: 'About', href: '/about' },
    { name: 'Events', href: '/events' },
    { name: 'Research', href: '/research' },
    { name: 'Resources', href: '/resources' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Contact', href: '/contact' },
  ],
  social: [
    { name: 'Facebook', href: '#', icon: Facebook },
    { name: 'Twitter', href: '#', icon: Twitter },
    { name: 'LinkedIn', href: '#', icon: Linkedin },
  ],
};

export default function Footer() {
  return (
    <footer className="text-white">
      {/* Upper Footer */}
      <div className="bg-[#06205c]">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Organization Info */}
            <div>
              <h3 className="text-xl font-bold text-white mb-4">
                STRATHMORE BUSINESS SCHOOL
              </h3>
              <p className="text-white/80 text-sm">
                Women in Healthcare Leadership advancing healthcare through innovative research and collaborative learning.
              </p>
            </div>
            
            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
              <ul className="space-y-3">
                <li className="flex items-start text-white/80">
                  <MapPin className="h-5 w-5 mr-2 mt-1 flex-shrink-0" />
                  <div>
                    <p>Ole Sangale Road, Madaraka</p>
                    <p>P.O. Box 59857 – 00200, Nairobi, Kenya</p>
                  </div>
                </li>
                <li className="flex items-center text-white/80">
                  <Phone className="h-5 w-5 mr-2 flex-shrink-0" />
                  <span>+254 703 034 414</span>
                </li>
                <li className="flex items-center text-white/80">
                  <MessageCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                  <span>WhatsApp: +254 (0) 746 091 242</span>
                </li>
                <li className="flex items-center text-white/80">
                  <Mail className="h-5 w-5 mr-2 flex-shrink-0" />
                  <span>whilproject@strathmore.edu</span>
                </li>
              </ul>
            </div>
            
            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
              <ul className="grid grid-cols-2 gap-2">
                {navigation.main.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className="text-white/80 hover:text-white transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Lower Footer */}
      <div className="bg-[#a9343a]">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <p className="text-white/80 text-sm mb-4 sm:mb-0">
              © {new Date().getFullYear()} WIHL Project at Strathmore Business School. All rights reserved.
            </p>
            <div className="flex items-center space-x-6">
              <div className="flex space-x-4">
                <Link
                  to="/admin"
                  className="inline-flex items-center px-4 py-2 border border-white text-sm font-medium text-white hover:bg-white hover:text-[#a9343a] transition-colors"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Admin Portal
                </Link>
              </div>
              {navigation.social.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    <span className="sr-only">{item.name}</span>
                    <Icon className="h-6 w-6" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}