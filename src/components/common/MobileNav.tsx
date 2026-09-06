import React from 'react';
import { Home, Code, Map, MessageSquare, User } from 'lucide-react';
import { Link } from '../../router/Link';

interface MobileNavProps {
  currentView: string;
  onNavigate?: (view: string) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentView }) => {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';

  const items = [
    { id: 'dashboard', label: 'Home', href: '/dashboard', icon: Home },
    { id: 'problems', label: 'Problems', href: '/problems', icon: Code },
    { id: 'roadmaps', label: 'Roadmap', href: '/roadmap', icon: Map },
    { id: 'discuss', label: 'Discuss', href: '/discussions', icon: MessageSquare },
    { id: 'profile', label: 'Profile', href: '/profile', icon: User },
  ];

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t border-white/[0.08] bg-[#09090c]/95 px-2 backdrop-blur-xl md:hidden"
      aria-label="Mobile Navigation"
    >
      {items.map(({ id, label, href, icon: Icon }) => {
        const isActive = 
          pathname === href ||
          (href !== '/dashboard' && pathname.startsWith(href)) ||
          (id === 'dashboard' && (pathname === '/' || pathname === '/dashboard')) ||
          (id === 'problems' && (pathname.startsWith('/problems') || pathname.startsWith('/saved')));

        return (
          <Link
            key={id}
            href={href}
            className={`flex flex-col items-center justify-center gap-1 rounded-xl py-1 px-3 text-[10px] font-medium transition-colors no-underline ${
              isActive ? 'text-amber-400 font-semibold' : 'text-white/50 hover:text-white/80'
            }`}
          >
            <Icon className={`h-5 w-5 ${isActive ? 'text-amber-400' : 'text-white/50'}`} />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
};
