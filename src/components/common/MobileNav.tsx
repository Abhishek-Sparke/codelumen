import React from 'react';
import { Home, Code, Map, MessageSquare, User } from 'lucide-react';

interface MobileNavProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentView, onNavigate }) => {
  const items = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'problems', label: 'Problems', icon: Code },
    { id: 'roadmaps', label: 'Roadmap', icon: Map },
    { id: 'discuss', label: 'Discuss', icon: MessageSquare },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t border-white/[0.08] bg-[#09090c]/95 px-2 backdrop-blur-xl md:hidden"
      aria-label="Mobile Navigation"
    >
      {items.map(({ id, label, icon: Icon }) => {
        const isActive = currentView === id || (id === 'dashboard' && currentView === 'landing');
        return (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className={`flex flex-col items-center justify-center gap-1 rounded-xl py-1 px-3 text-[10px] font-medium transition-colors ${
              isActive ? 'text-amber-400 font-semibold' : 'text-white/50 hover:text-white/80'
            }`}
          >
            <Icon className={`h-5 w-5 ${isActive ? 'text-amber-400' : 'text-white/50'}`} />
            <span>{label}</span>
          </button>
        );
      })}
    </nav>
  );
};
