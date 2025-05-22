import React, { useState, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import {
  Menu, ChefHat, LayoutDashboard, Users, ShoppingBag,
  ClipboardList, PieChart, Settings, Coffee, QrCode,
  CreditCard, Moon, Sun, Globe, PenSquare, Calculator,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import ProfileDropdown from '../components/profile/ProfileDropdown';
import NotificationDropdown from '../components/NotificationDropdown';

const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarHover, setSidebarHover] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const isPDV = location.pathname === '/pdv';
  const isComandas = location.pathname === '/comandas';

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} />, roles: ['admin', 'cashier'] },
    { name: 'Mesas', path: '/mesas', icon: <Coffee size={20} />, roles: ['admin', 'waiter'] },
    { name: 'Comandas', path: '/comandas', icon: <ClipboardList size={20} />, roles: ['admin', 'kitchen', 'waiter'] },
    { name: 'PDV', path: '/pdv', icon: <CreditCard size={20} />, roles: ['admin', 'cashier'] },
    { name: 'Cardápio', path: '/cardapio', icon: <ShoppingBag size={20} />, roles: ['admin', 'stock'] },
    { name: 'Estoque', path: '/estoque', icon: <ShoppingBag size={20} />, roles: ['admin', 'stock'] },
    { name: 'Pedidos iFood', path: '/ifood', icon: <ShoppingBag size={20} />, roles: ['admin', 'kitchen'] },
    { name: 'Relatórios', path: '/relatorios', icon: <PieChart size={20} />, roles: ['admin', 'cashier'] },
    { name: 'CMV', path: '/cmv', icon: <Calculator size={20} />, roles: ['admin'] },
    { name: 'Cardápio Online', path: '/cardapio-online', icon: <QrCode size={20} />, roles: ['admin'] },
    { name: 'Editor de Cardápio', path: '/cardapio-online/editor', icon: <PenSquare size={20} />, roles: ['admin'] },
    { name: 'Cardápio Online (Público)', path: '/cardapio/1', icon: <Globe size={20} />, roles: ['admin'] },
    { name: 'Central de Ajuda', path: '/ajuda', icon: <HelpCircle size={20} />, roles: ['admin', 'kitchen', 'waiter', 'cashier'] },
  ];

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  if (isPDV || isComandas) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 shadow-sm">
          <div className="h-16 px-4 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Menu size={24} className="text-gray-600 dark:text-gray-300" />
            </button>

            <div className="flex items-center space-x-2">
              <ChefHat size={28} className="text-blue-600 dark:text-blue-400" />
              <span className="text-xl font-bold text-gray-800 dark:text-gray-200">
                Chef Comanda
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                title="Alternar tema"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              <NotificationDropdown />
              <ProfileDropdown />
            </div>
          </div>
        </header>

        {sidebarOpen && (
          <>
            <aside
              className="fixed left-0 top-16 bottom-0 z-40 w-64 bg-white dark:bg-gray-800 shadow-lg"
              onMouseEnter={() => setSidebarHover(true)}
              onMouseLeave={() => setSidebarHover(false)}
            >
              <nav className="h-full py-4 overflow-y-auto">
                <div className="px-4 space-y-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${
                        location.pathname === item.path
                          ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      {item.icon}
                      <span className="ml-3">{item.name}</span>
                    </Link>
                  ))}
                </div>
              </nav>
            </aside>
            <div
              className="fixed inset-0 z-30 bg-black/20 dark:bg-black/40 transition-opacity"
              onClick={() => setSidebarOpen(false)}
            ></div>
          </>
        )}

        <main className="pt-16 min-h-screen">
          <Outlet />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 shadow-sm">
        <div className="h-16 px-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Menu size={24} className="text-gray-600 dark:text-gray-300" />
          </button>

          <div className="flex items-center space-x-2">
            <ChefHat size={28} className="text-blue-600 dark:text-blue-400" />
            <span className="text-xl font-bold text-gray-800 dark:text-gray-200">
              Chef Comanda
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              title="Alternar tema"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <NotificationDropdown />
            <ProfileDropdown />
          </div>
        </div>
      </header>

      <aside
        className={`fixed left-0 top-16 bottom-0 z-40 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out ${
          sidebarOpen || sidebarHover ? 'translate-x-0' : '-translate-x-full'
        }`}
        onMouseEnter={() => setSidebarHover(true)}
        onMouseLeave={() => setSidebarHover(false)}
      >
        <nav className="h-full py-4 overflow-y-auto">
          <div className="px-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${
                  location.pathname === item.path
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                {item.icon}
                <span className="ml-3">{item.name}</span>
              </Link>
            ))}
          </div>
        </nav>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20 dark:bg-black/40 transition-opacity"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <main className="pt-16 min-h-screen">
        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;