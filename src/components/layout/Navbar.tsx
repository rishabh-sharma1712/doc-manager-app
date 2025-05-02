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

  // Navbar specific styles for dark mode
  const navbarStyle = {
    backgroundColor: 'var(--card-bg)',
    borderBottom: '1px solid var(--border-color)',
    color: 'var(--primary-text)',
  };

  const brandStyle = {
    color: 'var(--button-bg)',
    fontWeight: 'bold',
  };

  const activeNavLinkStyle = {
    backgroundColor: 'var(--button-bg)',
    color: 'var(--button-text)',
  };

  const inactiveNavLinkStyle = {
    color: 'var(--primary-text)',
    ':hover': {
      backgroundColor: 'var(--border-color)',
    },
  };

  const usernameStyle = {
    color: 'var(--secondary-text)',
  };

  const logoutStyle = {
    color: 'var(--delete-button-text)',
    backgroundColor: 'var(--delete-button-bg)',
  };

  return (
    <nav style={navbarStyle} className="shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span style={brandStyle} className="font-bold text-xl">DocManager</span>
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
                    className={`px-3 py-2 rounded-md text-sm font-medium`}
                    style={link.active ? activeNavLinkStyle : inactiveNavLinkStyle}
                  >
                    {link.name}
                  </Link>
                ))}
            </div>
            {!isAuthenticated ? (
              <div className="ml-6 flex items-center">
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-sm font-medium rounded-md"
                  style={inactiveNavLinkStyle}
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="ml-2 px-4 py-2 text-sm font-medium rounded-md"
                  style={activeNavLinkStyle}
                >
                  Register
                </Link>
              </div>
            ) : (
              <div className="ml-6 flex items-center">
                <span className="text-sm font-medium mr-4" style={usernameStyle}>
                  {user?.username} ({user?.role})
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium rounded-md flex items-center"
                  style={logoutStyle}
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
              className="inline-flex items-center justify-center p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset"
              style={{ color: 'var(--primary-text)' }}
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
                  className={`block px-3 py-2 rounded-md text-base font-medium`}
                  style={link.active ? activeNavLinkStyle : inactiveNavLinkStyle}
                  onClick={closeMenu}
                >
                  {link.name}
                </Link>
              ))}
            {!isAuthenticated ? (
              <>
                <Link
                  href="/auth/login"
                  className="block px-3 py-2 rounded-md text-base font-medium"
                  style={inactiveNavLinkStyle}
                  onClick={closeMenu}
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="block px-3 py-2 rounded-md text-base font-medium"
                  style={activeNavLinkStyle}
                  onClick={closeMenu}
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <div className="px-3 py-2 text-sm font-medium" style={usernameStyle}>
                  {user?.username} ({user?.role})
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left block px-3 py-2 rounded-md text-base font-medium"
                  style={logoutStyle}
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