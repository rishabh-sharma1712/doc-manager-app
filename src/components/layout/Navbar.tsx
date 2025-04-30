import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { FiMenu, FiX, FiUser, FiLogOut, FiFileText, FiUsers } from 'react-icons/fi';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const isAdmin = user?.role === 'admin';

  const handleLogout = async () => {
    await logout();
    closeMenu();
  };

  const navLinks = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      show: isAuthenticated,
      active: pathname === '/dashboard',
    },
    {
      name: 'Documents',
      href: '/documents',
      show: isAuthenticated,
      active: pathname.startsWith('/documents'),
    },
    {
      name: 'Users',
      href: '/users',
      show: isAuthenticated && isAdmin,
      active: pathname.startsWith('/users'),
    },
  ];

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-blue-600 font-bold text-xl">DocManager</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex md:items-center">
            <div className="flex space-x-4">
              {navLinks
                .filter((link) => link.show)
                .map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      link.active
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
            </div>
            {!isAuthenticated ? (
              <div className="ml-6 flex items-center">
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="ml-2 px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Register
                </Link>
              </div>
            ) : (
              <div className="ml-6 flex items-center">
                <span className="text-sm font-medium text-gray-700 mr-4">
                  {user?.username} ({user?.role})
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium rounded-md text-red-700 hover:bg-red-100 flex items-center"
                >
                  <FiLogOut className="mr-1" />
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <FiX className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <FiMenu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks
              .filter((link) => link.show)
              .map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    link.active
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={closeMenu}
                >
                  {link.name}
                </Link>
              ))}
            {!isAuthenticated ? (
              <>
                <Link
                  href="/auth/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                  onClick={closeMenu}
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="block px-3 py-2 rounded-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
                  onClick={closeMenu}
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <div className="px-3 py-2 text-sm font-medium text-gray-700">
                  {user?.username} ({user?.role})
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-700 hover:bg-red-100"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 