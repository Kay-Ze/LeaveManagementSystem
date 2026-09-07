import { useState, useEffect } from 'react';
import AdminRibbon from '../components/AdminRibbon';
import PendingApprovalsCard from '../components/PendingApprovalsCard';
import OnLeaveTodayCard from '../components/OnLeaveTodayCard';
import TeamAttendanceCard from '../components/TeamAttendanceCard';
import AdminLeaveRequests from '../components/AdminLeaveRequests';
import JoinRequestsModal from '../components/JoinRequestsModal';
import {
  getLeaveRecords,
  fetchLeaveRecords,
  updateLeaveStatus,
  getAdminStats
} from '../services/leaveService';
import {
  getPendingJoinRequests,
  approveJoinRequest,
  rejectJoinRequest
} from '../services/authService';

const AdminDashboard = () => {
  const [records, setRecords] = useState(() => getLeaveRecords());
  const [stats, setStats] = useState(() => getAdminStats());
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [joinRequests, setJoinRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);

  const syncData = async () => {
    try {
      const data = await fetchLeaveRecords();
      setRecords(data);
      setStats(getAdminStats(data));
    } catch {
      // Ignore network sync issues
    }
  };

  const loadJoinRequests = async () => {
    try {
      const requests = await getPendingJoinRequests();
      setJoinRequests(requests || []);
    } catch {
      // Ignore
    }
  };

  useEffect(() => {
    syncData();
    loadJoinRequests();

    const handleLeaveUpdate = () => syncData();
    window.addEventListener('leave_records_changed', handleLeaveUpdate);

    const handleStorageChange = (e) => {
      if (!e.key || e.key === 'leave_management_records' || e.key === 'leave_records_sync_trigger') {
        syncData();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    const leaveInterval = setInterval(syncData, 3000);
    const joinInterval = setInterval(loadJoinRequests, 4000);

    return () => {
      window.removeEventListener('leave_records_changed', handleLeaveUpdate);
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(leaveInterval);
      clearInterval(joinInterval);
    };
  }, []);

  const handleApprove = async (id) => {
    await updateLeaveStatus(id, 'Approved');
    await syncData();
  };

  const handleReject = async (id) => {
    await updateLeaveStatus(id, 'Rejected');
    await syncData();
  };

  const handleApproveJoin = async (userId) => {
    setLoadingRequests(true);
    try {
      await approveJoinRequest(userId);
      await loadJoinRequests();
    } finally {
      setLoadingRequests(false);
    }
  };

  const handleRejectJoin = async (userId) => {
    setLoadingRequests(true);
    try {
      await rejectJoinRequest(userId);
      await loadJoinRequests();
    } finally {
      setLoadingRequests(false);
    }
  };

  return (
    <div className="flex flex-col h-screen px-6 lg:px-8 py-3 box-border overflow-hidden">
      <AdminRibbon
        pendingJoinCount={joinRequests.length}
        onOpenJoinRequests={() => setIsJoinModalOpen(true)}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 my-2.5 shrink-0">
        <PendingApprovalsCard pendingCount={stats.pendingRequests} />
        <OnLeaveTodayCard count={stats.onLeaveToday} />
        <TeamAttendanceCard />
      </div>

      <AdminLeaveRequests
        records={records}
        onApprove={handleApprove}
        onReject={handleReject}
        className="flex-1 min-h-0"
      />

      <JoinRequestsModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        requests={joinRequests}
        onApprove={handleApproveJoin}
        onReject={handleRejectJoin}
        loading={loadingRequests}
      />
    </div>
  );
};

export default AdminDashboard;
