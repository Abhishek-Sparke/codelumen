import React from 'react';
import { UserProfile } from '../../types';
import { AdminService } from '../../services/adminService';
import { AdminAccessDenied } from './AdminAccessDenied';
import { AdminLayout } from './AdminLayout';

interface AdminViewProps {
  currentUser: UserProfile | null;
  activeSection?: string;
  onNavigateProblem: (problemId: string) => void;
  onNavigateSection?: (section: string) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  currentUser,
  activeSection = 'dashboard',
  onNavigateProblem,
  onNavigateSection
}) => {
  // ZERO-TRUST ACCESS GATE:
  // If user is not authenticated or does not possess at least 'moderator' or 'admin' role,
  // immediately serve the 403 Forbidden Access Denied Gate.
  if (!currentUser || !AdminService.canAccessAdmin(currentUser.role)) {
    return (
      <AdminAccessDenied
        currentUser={currentUser}
      />
    );
  }

  return (
    <AdminLayout
      currentUser={currentUser}
      activeSection={activeSection}
      onNavigateSection={onNavigateSection || (() => {})}
      onNavigateProblem={onNavigateProblem}
    />
  );
};
