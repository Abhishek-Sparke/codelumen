import React, { useState } from 'react';
import { Settings, User, Eye, Terminal, Shield, Bell, Check } from 'lucide-react';
import { UserProfile } from '../../types';
import { StorageService, EditorSettings } from '../../services/storage';

interface SettingsViewProps {
  currentUser: UserProfile;
  onUpdateCurrentUser: (user: UserProfile) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  currentUser,
  onUpdateCurrentUser
}) => {
  const [activeSection, setActiveSection] = useState<'editor' | 'account' | 'appearance' | 'notifications'>('editor');
  const [editorSettings, setEditorSettings] = useState<EditorSettings>(StorageService.getSettings());
  const [name, setName] = useState(currentUser.name);
  const [bio, setBio] = useState(currentUser.bio);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveEditor = (updates: Partial<EditorSettings>) => {
    const updated = { ...editorSettings, ...updates };
    setEditorSettings(updated);
    StorageService.saveSettings(updated);
    showNotice();
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser: UserProfile = {
      ...currentUser,
      name,
      bio
    };
    StorageService.saveCurrentUser(updatedUser);
    onUpdateCurrentUser(updatedUser);
    showNotice();
  };

  const showNotice = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Header */}
      <div>
        <span className="lumen-tag text-amber-400">Customization</span>
        <h1 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Settings &amp; Preferences
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-white/50">
          Configure your editor environment, appearance tokens, and developer profile.
        </p>
      </div>

      {savedSuccess && (
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs font-semibold text-emerald-300 animate-in fade-in duration-150">
          <Check className="h-4 w-4" />
          <span>Preferences updated and persisted successfully.</span>
        </div>
      )}

      {/* Main Grid: Left Tabs & Right Settings Panel */}
      <div className="grid md:grid-cols-12 gap-8 items-start">
        
        {/* Left Nav */}
        <div className="md:col-span-4 space-y-1">
          {[
            { id: 'editor', label: 'Code Editor', icon: Terminal },
            { id: 'appearance', label: 'Theme & Appearance', icon: Eye },
            { id: 'account', label: 'Profile & Account', icon: User },
            { id: 'notifications', label: 'Notifications', icon: Bell },
          ].map((sec) => {
            const Icon = sec.icon;
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id as any)}
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-white/10 text-white font-semibold shadow-sm'
                    : 'text-white/60 hover:bg-white/[0.04] hover:text-white'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-amber-400' : 'text-white/40'}`} />
                <span>{sec.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Settings Form */}
        <div className="md:col-span-8 glass-panel rounded-3xl p-6 sm:p-8 border border-white/[0.08] bg-[#0c0c11] space-y-6">
          
          {/* EDITOR SETTINGS */}
          {activeSection === 'editor' && (
            <div className="space-y-6">
              <h2 className="font-display text-lg font-bold text-white border-b border-white/[0.08] pb-3">
                Code Editor Preferences
              </h2>

              {/* Font size */}
              <div>
                <label className="block text-xs font-medium text-white/70 mb-2">Editor Font Size</label>
                <div className="flex gap-2">
                  {[12, 14, 16, 18].map((size) => (
                    <button
                      key={size}
                      onClick={() => handleSaveEditor({ fontSize: size })}
                      className={`rounded-xl px-4 py-2 text-xs font-mono transition-colors ${
                        editorSettings.fontSize === size
                          ? 'bg-amber-400 font-bold text-black'
                          : 'border border-white/10 bg-white/5 text-white/60 hover:text-white'
                      }`}
                    >
                      {size}px
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab size */}
              <div>
                <label className="block text-xs font-medium text-white/70 mb-2">Tab Indent Size</label>
                <div className="flex gap-2">
                  {[2, 4].map((spaces) => (
                    <button
                      key={spaces}
                      onClick={() => handleSaveEditor({ tabSize: spaces })}
                      className={`rounded-xl px-4 py-2 text-xs font-mono transition-colors ${
                        editorSettings.tabSize === spaces
                          ? 'bg-amber-400 font-bold text-black'
                          : 'border border-white/10 bg-white/5 text-white/60 hover:text-white'
                      }`}
                    >
                      {spaces} spaces
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggle: Word wrap */}
              <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
                <div>
                  <span className="text-xs font-semibold text-white">Word Wrap</span>
                  <p className="text-[11px] text-white/40">Wrap long lines to fit editor viewport.</p>
                </div>
                <input
                  type="checkbox"
                  checked={editorSettings.wordWrap}
                  onChange={(e) => handleSaveEditor({ wordWrap: e.target.checked })}
                  className="h-4 w-4 rounded accent-amber-400 cursor-pointer"
                />
              </div>

              {/* Toggle: Auto-save */}
              <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
                <div>
                  <span className="text-xs font-semibold text-white">Auto-Save Code Changes</span>
                  <p className="text-[11px] text-white/40">Automatically persist editor progress to browser state.</p>
                </div>
                <input
                  type="checkbox"
                  checked={editorSettings.autoSave}
                  onChange={(e) => handleSaveEditor({ autoSave: e.target.checked })}
                  className="h-4 w-4 rounded accent-amber-400 cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* APPEARANCE SETTINGS */}
          {activeSection === 'appearance' && (
            <div className="space-y-6">
              <h2 className="font-display text-lg font-bold text-white border-b border-white/[0.08] pb-3">
                Theme &amp; Contrast
              </h2>

              <div className="space-y-3">
                <label className="block text-xs font-medium text-white/70">Theme Flavor</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'dark', title: 'Lumen Dark', desc: 'Deep obsidian (#09090c) with warm luminous glow' },
                    { id: 'dim', title: 'Charcoal Dim', desc: 'Slightly lifted ink background with cool borders' },
                    { id: 'system', title: 'System Adaptive', desc: 'Follows your operating system color scheme' },
                  ].map((thm) => (
                    <button
                      key={thm.id}
                      onClick={() => handleSaveEditor({ appearance: thm.id as any })}
                      className={`rounded-2xl border p-4 text-left transition-all ${
                        editorSettings.appearance === thm.id
                          ? 'border-amber-400 bg-amber-500/10 text-white'
                          : 'border-white/10 bg-white/5 text-white/60 hover:border-white/20'
                      }`}
                    >
                      <span className="text-xs font-bold text-white block">{thm.title}</span>
                      <span className="text-[10px] text-white/40 mt-1 block leading-relaxed">{thm.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ACCOUNT & PROFILE SETTINGS */}
          {activeSection === 'account' && (
            <form onSubmit={handleSaveProfile} className="space-y-5">
              <h2 className="font-display text-lg font-bold text-white border-b border-white/[0.08] pb-3">
                Public Profile Card
              </h2>

              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">Display Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400/50 resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-6 py-2.5 text-xs font-bold text-black shadow-md shadow-amber-500/20 hover:scale-105 active:scale-95 transition-transform"
                >
                  Save Profile
                </button>
              </div>
            </form>
          )}

          {/* NOTIFICATIONS SETTINGS */}
          {activeSection === 'notifications' && (
            <div className="space-y-4 text-xs">
              <h2 className="font-display text-lg font-bold text-white border-b border-white/[0.08] pb-3">
                Notification Channels
              </h2>

              <div className="space-y-3 pt-2">
                {[
                  'Daily challenge availability at midnight UTC',
                  'New followers on your profile',
                  'Someone replies to your community discussion thread',
                  'Contest starting reminder (1 hour prior)',
                  'Weekly streak milestone alerts'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2 border-b border-white/[0.04]">
                    <span className="text-white/80">{item}</span>
                    <input type="checkbox" defaultChecked className="h-4 w-4 rounded accent-amber-400 cursor-pointer" />
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
