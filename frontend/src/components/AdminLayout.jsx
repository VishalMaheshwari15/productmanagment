
import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon } from 'lucide-react';
import NotificationSidebar from './NotificationSidebar';

function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem('theme') === 'dark');
  const [notification, setNotification] = useState({ message: '', type: 'success' });
  const location = useLocation();

  useEffect(() => {
    const html = document.documentElement;
    const savedTheme = localStorage.getItem('theme') || 'light';
    setIsDarkMode(savedTheme === 'dark');
    html.classList.toggle('dark', savedTheme === 'dark');
    console.log('Initial theme:', savedTheme, 'HTML class:', html.className);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    const html = document.documentElement;
    html.classList.toggle('dark', newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
    setNotification({ message: `Switched to ${newMode ? 'dark' : 'light'} mode`, type: 'success' });
    console.log('Toggled theme:', newMode ? 'dark' : 'light', 'HTML class:', html.className);
  };

  const handleNavClick = () => {
    setIsSidebarOpen(false);
  };

  const navItems = [
    { path: '/admin/products', label: 'Products', ariaLabel: 'Manage Products' },
    { path: '/admin/categories', label: 'Categories', ariaLabel: 'Manage Categories' },
    { path: '/admin/materials', label: 'Materials', ariaLabel: 'Manage Materials' },
    { path: '/admin/colors', label: 'Colors', ariaLabel: 'Manage Colors' },
    { path: '/admin/sizes', label: 'Sizes', ariaLabel: 'Manage Sizes' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 ease-in-out border-r border-gray-200 dark:border-gray-700`}
        aria-label="Main navigation"
      >
        <div className="p-4">
          <nav className="mt-4">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`block px-4 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-600 transition-colors ${
                      location.pathname === item.path ? 'bg-blue-500 text-white dark:bg-blue-600' : ''
                    }`}
                    onClick={handleNavClick}
                    aria-current={location.pathname === item.path ? 'page' : undefined}
                    aria-label={item.ariaLabel}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>

      <div className="flex-1 flex flex-col md:ml-64">
        <header className="bg-white dark:bg-gray-800 shadow-sm p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
          <button
            className="md:hidden text-gray-700 dark:text-gray-200"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            {navItems.find((item) => item.path === location.pathname)?.label || 'Dashboard'}
          </h2>
          <button
            onClick={toggleDarkMode}
            className="flex items-center space-x-2 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            <span className="hidden sm:inline">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </header>

        <main className="flex-1 p-6 bg-gray-100 dark:bg-gray-900">
          <Outlet />
        </main>
      </div>

      <NotificationSidebar
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ message: '', type: 'success' })}
      />
    </div>
  );
}

export default AdminLayout;
