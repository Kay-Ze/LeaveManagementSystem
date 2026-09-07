import { useState, useEffect } from 'react';
import Ribbon from '../components/Ribbon';
import TotalLeaveCard from '../components/TotalLeaveCard';
import TakenLeaveCard from '../components/TakenLeaveCard';
import RemainingLeaveCard from '../components/RemainingLeaveCard';
import LeaveHistory from '../components/LeaveHistory';
import LeaveForm from '../components/LeaveForm';
import {
  getLeaveRecords,
  fetchLeaveRecords,
  getLeaveStats,
  submitLeaveRequest,
  withdrawLeaveRequest
} from '../services/leaveService';

const Dashboard = () => {
  const [records, setRecords] = useState(() => getLeaveRecords());
  const [stats, setStats] = useState(() => getLeaveStats());
  const [isModalOpen, setIsModalOpen] = useState(false);

  const syncData = async () => {
    try {
      const data = await fetchLeaveRecords();
      setRecords(data);
      setStats(getLeaveStats(data));
    } catch {
      // Ignore network sync issues
    }
  };

  useEffect(() => {
    syncData();

    const handleLeaveUpdate = () => syncData();
    window.addEventListener('leave_records_changed', handleLeaveUpdate);

    const handleStorageChange = (e) => {
      if (!e.key || e.key === 'leave_management_records' || e.key === 'leave_records_sync_trigger') {
        syncData();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    const interval = setInterval(syncData, 3000);

    return () => {
      window.removeEventListener('leave_records_changed', handleLeaveUpdate);
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const handleApplyLeave = async (formData) => {
    setIsModalOpen(false);
    await submitLeaveRequest(formData);
    await syncData();
  };

  const handleWithdrawLeave = async (id) => {
    await withdrawLeaveRequest(id);
    await syncData();
  };

  return (
    <div className="flex flex-col h-screen px-6 lg:px-8 py-3 box-border overflow-hidden">
      <Ribbon onApplyLeave={() => setIsModalOpen(true)} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 my-2.5 shrink-0">
        <TotalLeaveCard total={stats.totalAllocated} />
        <TakenLeaveCard taken={stats.leavesTaken} />
        <RemainingLeaveCard
          remaining={stats.remainingBalance}
          total={stats.totalAllocated}
          breakdown={stats.breakdown}
        />
      </div>

      <LeaveHistory
        records={records}
        onWithdraw={handleWithdrawLeave}
        className="flex-1 min-h-0"
      />

      <LeaveForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleApplyLeave}
        balances={stats}
      />
    </div>
  );
};

export default Dashboard;
