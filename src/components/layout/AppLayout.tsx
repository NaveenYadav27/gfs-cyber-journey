import { Link, Outlet, useRouterState } from '@tanstack/react-router';
import { useCyberOS } from '@/context/CyberOSContext';
import {
  ShieldAlert,
  Terminal,
  Search,
  BookOpen,
  LayoutDashboard,
  Award,
  Settings,
  LogOut,
  Menu,
  Bell,
  Cpu
} from 'lucide-react';
import { useState } from 'react';

export function AppLayout() {
  const { state, dispatch, getOpenAlertCount } = useCyberOS();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouterState();

  const currentPath = router.location.pathname;

  const openAlerts = getOpenAlertCount();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { label: 'Training Modules', path: '/modules', icon: <BookOpen size={20} /> },
    { label: 'Cyber Range', path: '/range', icon: <Terminal size={20} /> },
    { label: 'SOC Console', path: '/soc', icon: <ShieldAlert size={20} />, badge: openAlerts > 0 ? openAlerts : null },
    { label: 'SIEM Log Search', path: '/siem', icon: <Search size={20} /> },
    { label: 'AI Copilot', path: '/copilot', icon: <Cpu size={20} /> },
    { label: 'Achievements', path: '/achievements', icon: <Award size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-[#0a0a0c] text-slate-300 font-mono overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } flex-shrink-0 border-r border-slate-800 bg-[#0f0f13] transition-all duration-300 flex flex-col z-20`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800 shrink-0">
          {sidebarOpen ? (
            <div className="flex items-center space-x-2">
              <ShieldAlert className="text-blue-500" size={24} />
              <span className="font-bold text-white tracking-wider">CyberOS</span>
            </div>
          ) : (
            <ShieldAlert className="text-blue-500 mx-auto" size={24} />
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-slate-400 hover:text-white">
            <Menu size={20} />
          </button>
        </div>

        <div className="p-4 shrink-0 border-b border-slate-800">
          {sidebarOpen ? (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center text-blue-200 font-bold border border-blue-700">
                {state.user.avatarInitials}
              </div>
              <div className="overflow-hidden">
                <div className="text-sm font-semibold text-white truncate">{state.user.fullName}</div>
                <div className="text-xs text-slate-400 truncate">{state.user.role}</div>
              </div>
            </div>
          ) : (
            <div className="w-10 h-10 mx-auto rounded-full bg-blue-900 flex items-center justify-center text-blue-200 font-bold border border-blue-700">
              {state.user.avatarInitials}
            </div>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1 scrollbar-hide">
          {navItems.map((item) => {
            const isActive = currentPath.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center ${
                  sidebarOpen ? 'px-3' : 'justify-center'
                } py-3 rounded-md transition-colors ${
                  isActive
                    ? 'bg-blue-900/40 text-blue-400 border border-blue-800/50'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                }`}
                title={!sidebarOpen ? item.label : undefined}
              >
                <div className="relative">
                  {item.icon}
                  {!sidebarOpen && item.badge && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </div>
                {sidebarOpen && (
                  <span className="ml-3 text-sm font-medium flex-1">{item.label}</span>
                )}
                {sidebarOpen && item.badge && (
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 shrink-0 border-t border-slate-800 space-y-2">
          <Link
            to="/dashboard"
            className={`flex items-center ${
              sidebarOpen ? 'px-3' : 'justify-center'
            } py-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-md`}
          >
            <Settings size={20} />
            {sidebarOpen && <span className="ml-3 text-sm">Settings</span>}
          </Link>
          <button
            className={`flex items-center w-full ${
              sidebarOpen ? 'px-3' : 'justify-center'
            } py-2 text-slate-400 hover:text-red-400 hover:bg-red-900/20 rounded-md`}
            onClick={() => {
              dispatch({ type: 'RESET_ALL' });
              window.location.href = '/';
            }}
          >
            <LogOut size={20} />
            {sidebarOpen && <span className="ml-3 text-sm">Log Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 flex items-center justify-between px-6 border-b border-slate-800 bg-[#0f0f13] shrink-0 z-10">
          <div className="flex items-center space-x-4">
            <div className="px-3 py-1 bg-slate-800 rounded text-xs text-slate-300 border border-slate-700 flex items-center">
              <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
              GFS Cyber Range Active
            </div>
            <div className="text-xs text-slate-500 hidden sm:block">
              Clearance: <span className="text-orange-400 font-semibold">{state.user.clearance}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center text-sm">
              <span className="text-slate-400 mr-2">Level {state.level}</span>
              <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                <div 
                  className="h-full bg-blue-500 rounded-full" 
                  style={{ width: `${Math.min(100, Math.max(0, ((state.xp - (state.level === 1 ? 0 : 500)) / 500) * 100))}%` }}
                />
              </div>
              <span className="text-blue-400 ml-2 font-bold">{state.xp} XP</span>
            </div>
            
            <button className="relative text-slate-400 hover:text-white transition-colors">
              <Bell size={20} />
              {openAlerts > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 w-2.5 h-2.5 rounded-full border-2 border-[#0f0f13]"></span>
              )}
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-[#0a0a0c] relative">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(20,20,30,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(20,20,30,0.5)_1px,transparent_1px)] bg-[size:30px_30px] opacity-20 pointer-events-none"></div>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
