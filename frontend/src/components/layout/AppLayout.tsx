import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { TopBar } from './TopBar';

export function AppLayout() {
  return (
    <div className="min-h-screen bg-gray-950">
      {/* Desktop sidebar */}
      <Sidebar />

      {/* Mobile top bar */}
      <TopBar />

      {/* Main content */}
      <main className="lg:pl-64 pb-20 lg:pb-0">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <Outlet />
        </div>
      </main>

      {/* Mobile bottom nav */}
      <BottomNav />
    </div>
  );
}
