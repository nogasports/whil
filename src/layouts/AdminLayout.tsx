import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, Calendar, Library, Users, Settings, LogOut, Users2 } from 'lucide-react';
import { useAuth } from '../lib/hooks/useAuth';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Projects', href: '/admin/projects', icon: FolderKanban },
  { name: 'Events', href: '/admin/events', icon: Calendar },
  { name: 'Resources', href: '/admin/resources', icon: Library },
  { name: 'Community', href: '/admin/community', icon: Users2 },
  { name: 'Admin', href: '/admin/users', icon: Users },
];

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#e6e6e6]">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold text-[#00205b]">WIHL Admin</span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href || 
                                 location.pathname.startsWith(`${item.href}/`);
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`inline-flex items-center px-3 py-2 text-sm font-medium ${
                        isActive
                          ? 'text-[#00205b] bg-[#e6e6e6]'
                          : 'text-gray-600 hover:text-[#00205b] hover:bg-[#e6e6e6]'
                      }`}
                    >
                      <Icon className="h-5 w-5 mr-2" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="inline-flex items-center p-2 text-gray-600 hover:text-[#00205b] hover:bg-[#e6e6e6]">
                <Settings className="h-5 w-5" />
              </button>
              <div className="flex items-center">
                <img
                  className="h-8 w-8 rounded-full mr-4"
                  src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName || 'Admin'}&background=random`}
                  alt="User avatar"
                />
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-600 hover:text-[#a4343a] hover:bg-[#e6e6e6]"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow">
          <Outlet />
        </div>
      </div>
    </div>
  );
}