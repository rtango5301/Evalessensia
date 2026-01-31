// Settings Page - Manage account preferences and team settings
// Route: /dashboard/settings

'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

// ============================================================================
// MOCK DATA
// ============================================================================

const mockUser = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  role: 'Admin',
  avatar: null,
};

const mockTeamMembers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Admin',
    avatar: null,
  },
  {
    id: '2',
    name: 'Sarah Chen',
    email: 'sarah.chen@example.com',
    role: 'Editor',
    avatar: null,
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike.johnson@example.com',
    role: 'Viewer',
    avatar: null,
  },
];

// ============================================================================
// TOGGLE COMPONENT
// ============================================================================

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

function Toggle({ checked, onChange, disabled = false }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#135bec] focus-visible:ring-offset-2',
        checked ? 'bg-[#135bec]' : 'bg-slate-200',
        disabled && 'cursor-not-allowed opacity-50'
      )}
    >
      <span
        className={cn(
          'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out',
          checked ? 'translate-x-5' : 'translate-x-0'
        )}
      />
    </button>
  );
}

// ============================================================================
// TAB DEFINITIONS
// ============================================================================

type TabId = 'profile' | 'notifications' | 'team' | 'appearance' | 'danger';

const tabs: { id: TabId; label: string; icon: string }[] = [
  { id: 'profile', label: 'Profile', icon: 'person' },
  { id: 'notifications', label: 'Notifications', icon: 'notifications' },
  { id: 'team', label: 'Team', icon: 'group' },
  { id: 'appearance', label: 'Appearance', icon: 'palette' },
  { id: 'danger', label: 'Danger Zone', icon: 'warning' },
];

// ============================================================================
// MAIN SETTINGS PAGE
// ============================================================================

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>('profile');

  // Profile state
  const [fullName, setFullName] = useState(mockUser.name);
  const [email, setEmail] = useState(mockUser.email);

  // Notifications state
  const [emailNotifications, setEmailNotifications] = useState({
    evaluationCompleted: true,
    evaluationFailed: true,
    weeklySummary: false,
    performanceAlerts: true,
  });
  const [inAppNotifications, setInAppNotifications] = useState({
    realTimeUpdates: true,
    teamActivity: false,
    systemAnnouncements: true,
  });

  // Team state
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Viewer');

  // Appearance state
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light');
  const [compactMode, setCompactMode] = useState(false);

  // ============================================================================
  // RENDER FUNCTIONS
  // ============================================================================

  const renderProfileTab = () => (
    <div className="space-y-6">
      {/* Avatar Section */}
      <div className="flex items-center gap-4">
        <div className="size-20 rounded-full bg-slate-200 flex items-center justify-center">
          <span className="material-symbols-outlined text-4xl text-slate-400">person</span>
        </div>
        <div>
          <button type="button" className="text-sm font-medium text-[#135bec] hover:underline">
            Change photo
          </button>
          <p className="text-xs text-slate-500 mt-1">JPG, PNG or GIF. Max 2MB.</p>
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-slate-900 mb-2">Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm placeholder-slate-400 focus:ring-2 focus:ring-[#135bec] focus:border-transparent transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-900 mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm placeholder-slate-400 focus:ring-2 focus:ring-[#135bec] focus:border-transparent transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-900 mb-2">Role</label>
          <input
            type="text"
            value={mockUser.role}
            disabled
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 text-sm cursor-not-allowed"
          />
          <p className="text-xs text-slate-400 mt-1">Role can only be changed by an admin.</p>
        </div>
      </div>

      {/* Save Button */}
      <div className="pt-4 border-t border-slate-200">
        <button
          type="button"
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm bg-[#135bec] hover:bg-[#135bec]/90 text-white shadow-sm transition-all"
        >
          <span className="material-symbols-outlined text-lg">save</span>
          Save Changes
        </button>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-8">
      {/* Email Notifications */}
      <div>
        <h3 className="text-base font-bold text-slate-900 mb-4">Email Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-slate-100">
            <div>
              <p className="text-sm font-medium text-slate-900">Evaluation completed</p>
              <p className="text-xs text-slate-500">
                Get notified when an evaluation run finishes successfully.
              </p>
            </div>
            <Toggle
              checked={emailNotifications.evaluationCompleted}
              onChange={(checked) =>
                setEmailNotifications((prev) => ({ ...prev, evaluationCompleted: checked }))
              }
            />
          </div>
          <div className="flex items-center justify-between py-3 border-b border-slate-100">
            <div>
              <p className="text-sm font-medium text-slate-900">Evaluation failed</p>
              <p className="text-xs text-slate-500">
                Get notified when an evaluation run fails or encounters errors.
              </p>
            </div>
            <Toggle
              checked={emailNotifications.evaluationFailed}
              onChange={(checked) =>
                setEmailNotifications((prev) => ({ ...prev, evaluationFailed: checked }))
              }
            />
          </div>
          <div className="flex items-center justify-between py-3 border-b border-slate-100">
            <div>
              <p className="text-sm font-medium text-slate-900">Weekly summary</p>
              <p className="text-xs text-slate-500">
                Receive a weekly digest of your agent performance metrics.
              </p>
            </div>
            <Toggle
              checked={emailNotifications.weeklySummary}
              onChange={(checked) =>
                setEmailNotifications((prev) => ({ ...prev, weeklySummary: checked }))
              }
            />
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-slate-900">Performance alerts</p>
              <p className="text-xs text-slate-500">
                Get alerted when agent performance drops below thresholds.
              </p>
            </div>
            <Toggle
              checked={emailNotifications.performanceAlerts}
              onChange={(checked) =>
                setEmailNotifications((prev) => ({ ...prev, performanceAlerts: checked }))
              }
            />
          </div>
        </div>
      </div>

      {/* In-App Notifications */}
      <div>
        <h3 className="text-base font-bold text-slate-900 mb-4">In-App Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-slate-100">
            <div>
              <p className="text-sm font-medium text-slate-900">Real-time updates</p>
              <p className="text-xs text-slate-500">Show live updates as evaluations progress.</p>
            </div>
            <Toggle
              checked={inAppNotifications.realTimeUpdates}
              onChange={(checked) =>
                setInAppNotifications((prev) => ({ ...prev, realTimeUpdates: checked }))
              }
            />
          </div>
          <div className="flex items-center justify-between py-3 border-b border-slate-100">
            <div>
              <p className="text-sm font-medium text-slate-900">Team activity</p>
              <p className="text-xs text-slate-500">
                Get notified about team members&apos; actions.
              </p>
            </div>
            <Toggle
              checked={inAppNotifications.teamActivity}
              onChange={(checked) =>
                setInAppNotifications((prev) => ({ ...prev, teamActivity: checked }))
              }
            />
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-slate-900">System announcements</p>
              <p className="text-xs text-slate-500">
                Receive important system updates and announcements.
              </p>
            </div>
            <Toggle
              checked={inAppNotifications.systemAnnouncements}
              onChange={(checked) =>
                setInAppNotifications((prev) => ({ ...prev, systemAnnouncements: checked }))
              }
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderTeamTab = () => (
    <div className="space-y-6">
      {/* Invite Form */}
      <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
        <h3 className="text-base font-bold text-slate-900 mb-4">Invite Team Member</h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="Enter email address"
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm placeholder-slate-400 focus:ring-2 focus:ring-[#135bec] focus:border-transparent transition-all"
            />
          </div>
          <div className="sm:w-40">
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:ring-2 focus:ring-[#135bec] focus:border-transparent transition-all cursor-pointer"
            >
              <option value="Viewer">Viewer</option>
              <option value="Editor">Editor</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <button
            type="button"
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm bg-[#135bec] hover:bg-[#135bec]/90 text-white shadow-sm transition-all whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-lg">person_add</span>
            Send Invite
          </button>
        </div>
      </div>

      {/* Team Members Table */}
      <div>
        <h3 className="text-base font-bold text-slate-900 mb-4">Team Members</h3>
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {mockTeamMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-slate-200 flex items-center justify-center">
                          <span className="material-symbols-outlined text-sm text-slate-400">
                            person
                          </span>
                        </div>
                        <div className="text-sm font-medium text-slate-900">{member.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{member.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                          member.role === 'Admin' && 'bg-purple-100 text-purple-800',
                          member.role === 'Editor' && 'bg-blue-100 text-blue-800',
                          member.role === 'Viewer' && 'bg-slate-100 text-slate-600'
                        )}
                      >
                        {member.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                      >
                        <span className="material-symbols-outlined text-lg">more_vert</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAppearanceTab = () => (
    <div className="space-y-8">
      {/* Theme Selection */}
      <div>
        <h3 className="text-base font-bold text-slate-900 mb-4">Theme</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { id: 'light', label: 'Light', icon: 'light_mode' },
            { id: 'dark', label: 'Dark', icon: 'dark_mode' },
            { id: 'system', label: 'System', icon: 'devices' },
          ].map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setTheme(option.id as typeof theme)}
              className={cn(
                'flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all',
                theme === option.id
                  ? 'border-[#135bec] bg-[#135bec]/5'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              )}
            >
              <div
                className={cn(
                  'size-12 rounded-full flex items-center justify-center',
                  theme === option.id ? 'bg-[#135bec]/10' : 'bg-slate-100'
                )}
              >
                <span
                  className={cn(
                    'material-symbols-outlined text-2xl',
                    theme === option.id ? 'text-[#135bec]' : 'text-slate-500'
                  )}
                >
                  {option.icon}
                </span>
              </div>
              <span
                className={cn(
                  'text-sm font-medium',
                  theme === option.id ? 'text-[#135bec]' : 'text-slate-700'
                )}
              >
                {option.label}
              </span>
              <div
                className={cn(
                  'size-5 rounded-full border-2 flex items-center justify-center',
                  theme === option.id ? 'border-[#135bec]' : 'border-slate-300'
                )}
              >
                {theme === option.id && <div className="size-2.5 rounded-full bg-[#135bec]" />}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Compact Mode */}
      <div>
        <h3 className="text-base font-bold text-slate-900 mb-4">Display</h3>
        <div className="flex items-center justify-between py-3 px-4 bg-white border border-slate-200 rounded-xl">
          <div>
            <p className="text-sm font-medium text-slate-900">Compact mode</p>
            <p className="text-xs text-slate-500">
              Reduce spacing and padding throughout the interface.
            </p>
          </div>
          <Toggle checked={compactMode} onChange={setCompactMode} />
        </div>
      </div>
    </div>
  );

  const renderDangerZoneTab = () => (
    <div className="space-y-6">
      {/* Export Data */}
      <div className="bg-white rounded-xl p-6 border border-slate-200">
        <div className="flex items-start gap-4">
          <div className="size-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-slate-600">download</span>
          </div>
          <div className="flex-1">
            <h3 className="text-base font-bold text-slate-900">Export Data</h3>
            <p className="text-sm text-slate-500 mt-1">
              Download all your agents, evaluations, and settings in a portable format.
            </p>
            <button
              type="button"
              className="mt-4 flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <span className="material-symbols-outlined text-lg">file_download</span>
              Export All Data
            </button>
          </div>
        </div>
      </div>

      {/* Delete Account */}
      <div className="bg-red-50 rounded-xl p-6 border border-red-200">
        <div className="flex items-start gap-4">
          <div className="size-10 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-red-600">delete_forever</span>
          </div>
          <div className="flex-1">
            <h3 className="text-base font-bold text-red-900">Delete Account</h3>
            <p className="text-sm text-red-700 mt-1">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <button
              type="button"
              className="mt-4 flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm bg-red-600 text-white hover:bg-red-700 transition-colors"
            >
              <span className="material-symbols-outlined text-lg">delete</span>
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileTab();
      case 'notifications':
        return renderNotificationsTab();
      case 'team':
        return renderTeamTab();
      case 'appearance':
        return renderAppearanceTab();
      case 'danger':
        return renderDangerZoneTab();
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      {/* Header Section */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Settings</h1>
        <p className="text-slate-500 text-sm">Manage your account preferences and team settings.</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-slate-200">
        <nav className="flex gap-6 overflow-x-auto" aria-label="Settings tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
                activeTab === tab.id
                  ? 'border-[#135bec] text-[#135bec]'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              )}
            >
              <span className="material-symbols-outlined text-lg">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        {renderTabContent()}
      </div>
    </div>
  );
}
