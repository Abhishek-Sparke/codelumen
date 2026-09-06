import React, { useEffect, useState } from 'react';
import {
  Settings,
  Save,
  AlertTriangle,
  ToggleLeft,
  ToggleRight,
  Check,
  Shield,
  Sliders,
  Globe
} from 'lucide-react';
import { UserProfile, PlatformSettings } from '../../../types';
import { AdminService } from '../../../services/adminService';

interface AdminSettingsViewProps {
  currentUser: UserProfile;
}

export const AdminSettingsView: React.FC<AdminSettingsViewProps> = ({ currentUser }) => {
  const [settings, setSettings] = useState<PlatformSettings | null>(null);
  const [siteName, setSiteName] = useState('CodeSpark');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceNotice, setMaintenanceNotice] = useState('');
  const [registrationsOpen, setRegistrationsOpen] = useState(true);
  const [guestSubmissions, setGuestSubmissions] = useState(true);
  const [publicLeaderboard, setPublicLeaderboard] = useState(true);
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const loadSettings = async () => {
    setLoading(true);
    const res = await AdminService.getSettings(currentUser);
    if (res.success && res.settings) {
      setSettings(res.settings);
      setSiteName(res.settings.siteName || 'CodeSpark');
      setMaintenanceMode(res.settings.maintenanceMode || false);
      setMaintenanceNotice(res.settings.maintenanceNotice || 'CodeSpark is undergoing scheduled maintenance.');
      setRegistrationsOpen(res.settings.registrationsOpen ?? true);
      setGuestSubmissions(res.settings.guestSubmissionsAllowed ?? true);
      setPublicLeaderboard(res.settings.publicLeaderboardEnabled ?? true);
      setFlags(res.settings.featureFlags || {});
    }
    setLoading(false);
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    const res = await AdminService.updateSettings(currentUser, {
      siteName,
      maintenanceMode,
      maintenanceNotice,
      registrationsOpen,
      guestSubmissionsAllowed: guestSubmissions,
      publicLeaderboardEnabled: publicLeaderboard,
      featureFlags: flags
    });

    if (res.success) {
      showToast('Platform settings and feature flags updated.');
    } else {
      showToast(res.error || 'Failed to update settings');
    }
    setIsSaving(false);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-emerald-500/90 px-4 py-3 text-white text-xs font-semibold shadow-2xl backdrop-blur-md">
          <Check className="h-4 w-4" />
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Settings className="h-6 w-6 text-amber-400" />
            Platform Configuration & Settings
          </h1>
          <p className="text-sm text-white/60 mt-1">
            Global site properties, maintenance mode, registration gateways, and platform runtime flags.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-black text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/20 self-start sm:self-auto"
        >
          <Save className="h-4 w-4" />
          {isSaving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      {/* Maintenance Mode Warning */}
      {maintenanceMode && (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 backdrop-blur-sm flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
          <div className="text-xs text-white/80">
            <strong className="text-red-400 font-semibold block mb-0.5">Maintenance Mode is Active</strong>
            Public users will see the maintenance interstitial. Administrative operators remain unaffected.
          </div>
        </div>
      )}

      {/* Site Identity */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#0c0c14] p-6 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Globe className="h-5 w-5 text-blue-400" />
          Platform Identity & Operational Modes
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-white/70 mb-1.5">
              Platform Name
            </label>
            <input
              type="text"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className="w-full sm:w-96 px-3.5 py-2 rounded-xl border border-white/10 bg-[#14141f] text-white text-sm focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="pt-2 border-t border-white/5 space-y-3">
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02]">
              <div>
                <div className="font-semibold text-white text-sm">Maintenance Mode</div>
                <div className="text-xs text-white/50">Display maintenance banner across user sessions.</div>
              </div>
              <input
                type="checkbox"
                checked={maintenanceMode}
                onChange={(e) => setMaintenanceMode(e.target.checked)}
                className="h-5 w-5 rounded accent-amber-400 cursor-pointer"
              />
            </div>

            {maintenanceMode && (
              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">
                  Public Maintenance Notice
                </label>
                <textarea
                  rows={2}
                  value={maintenanceNotice}
                  onChange={(e) => setMaintenanceNotice(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-white/10 bg-[#14141f] text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>
            )}

            <div className="flex items-center justify-between p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02]">
              <div>
                <div className="font-semibold text-white text-sm">Public Account Registrations</div>
                <div className="text-xs text-white/50">Allow new visitors to register accounts.</div>
              </div>
              <input
                type="checkbox"
                checked={registrationsOpen}
                onChange={(e) => setRegistrationsOpen(e.target.checked)}
                className="h-5 w-5 rounded accent-amber-400 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02]">
              <div>
                <div className="font-semibold text-white text-sm">Guest Code Submissions</div>
                <div className="text-xs text-white/50">Permit running and submitting code in guest mode.</div>
              </div>
              <input
                type="checkbox"
                checked={guestSubmissions}
                onChange={(e) => setGuestSubmissions(e.target.checked)}
                className="h-5 w-5 rounded accent-amber-400 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02]">
              <div>
                <div className="font-semibold text-white text-sm">Public Leaderboard</div>
                <div className="text-xs text-white/50">Display global rankings and streaks publicly.</div>
              </div>
              <input
                type="checkbox"
                checked={publicLeaderboard}
                onChange={(e) => setPublicLeaderboard(e.target.checked)}
                className="h-5 w-5 rounded accent-amber-400 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
