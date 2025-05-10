// src/components/AdminLayout.jsx
import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Products', ariaLabel: 'Manage Products' },
    { path: '/categories', label: 'Categories', ariaLabel: 'Manage Categories' },
    { path: '/materials', label: 'Materials', ariaLabel: 'Manage Materials' },
    { path: '/colors', label: 'Colors', ariaLabel: 'Manage Colors' },
    { path: '/sizes', label: 'Sizes', ariaLabel: 'Manage Sizes' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 ease-in-out`}
        aria-label="Main navigation"
      >
        <div className="p-4">
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <nav className="mt-6">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`block px-4 py-2 rounded-md text-gray-700 hover:bg-blue-100 hover:text-blue-700 ${
                      location.pathname === item.path ? 'bg-blue-100 text-blue-700' : ''
                    }`}
                    onClick={() => setIsSidebarOpen(false)}
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-64">
        {/* Navbar */}
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h2 className="text-xl font-semibold text-gray-800">Product Management</h2>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            aria-label="Logout"
          >
            Logout
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          <Outlet/>
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;