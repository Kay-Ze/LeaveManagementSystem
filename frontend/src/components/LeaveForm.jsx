import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { calculateWorkingDays } from '../utils/dateUtils';
import { getLeaveStats } from '../services/leaveService';

const LeaveForm = ({ isOpen, onClose, onSubmit, balances }) => {
  const [leaveType, setLeaveType] = useState('Annual Leave');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  // Calculate remaining balances
  const stats = balances || getLeaveStats();
  const currentBalances = stats.balanceByType || {};
  const duration = calculateWorkingDays(startDate, endDate);
  const selectedBalance = currentBalances[leaveType];

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!startDate || !endDate) {
      setError('Please select both start and end dates.');
      return;
    }

    if (duration <= 0) {
      setError('End date must be on or after start date.');
      return;
    }

    if (leaveType !== 'Unpaid Leave' && typeof selectedBalance === 'number') {
      if (selectedBalance <= 0) {
        setError(`You have 0 days remaining for ${leaveType}.`);
        return;
      }
      if (duration > selectedBalance) {
        setError(`Duration (${duration} days) exceeds available ${leaveType} balance (${selectedBalance} days).`);
        return;
      }
    }

    if (!reason.trim()) {
      setError('Please provide a reason for the leave.');
      return;
    }

    setError('');
    onSubmit({
      leaveType,
      startDate,
      endDate,
      duration,
      reason
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="max-w-lg w-full bg-[#141414] border border-white/20 rounded-2xl p-7 shadow-2xl backdrop-blur-2xl">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <h3 className="text-xl font-semibold text-white tracking-tight">
            Apply for Leave
          </h3>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-white/10 text-white/60 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mt-3 text-xs text-red-400 bg-red-950/40 border border-red-500/30 px-3.5 py-2.5 rounded-xl flex items-center gap-2">
            <AlertCircle size={15} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs uppercase tracking-wider text-white/60">
                Leave Type
              </label>
              {leaveType !== 'Unpaid Leave' && typeof selectedBalance === 'number' && (
                <span className="text-[11px] font-medium text-white/80 bg-white/10 px-2 py-0.5 rounded-md border border-white/15">
                  Available: <strong className="text-white">{selectedBalance}</strong> days
                </span>
              )}
            </div>

            <select
              value={leaveType}
              onChange={(e) => {
                setLeaveType(e.target.value);
                setError('');
              }}
              className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white"
            >
              <option className="bg-[#111] text-white" value="Annual Leave">
                Annual Leave (Balance: {currentBalances['Annual Leave'] ?? 18} Days)
              </option>
              <option className="bg-[#111] text-white" value="Casual Leave">
                Casual Leave (Balance: {currentBalances['Casual Leave'] ?? 8} Days)
              </option>
              <option className="bg-[#111] text-white" value="Sick Leave">
                Sick Leave (Balance: {currentBalances['Sick Leave'] ?? 4} Days)
              </option>
              <option className="bg-[#111] text-white" value="Unpaid Leave">
                Unpaid Leave (Unlimited)
              </option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs uppercase tracking-wider text-white/60 mb-1.5">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                onClick={(e) => e.target.showPicker?.()}
                className="w-full bg-black/60 border border-white/15 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-white cursor-pointer [color-scheme:dark]"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-white/60 mb-1.5">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                onClick={(e) => e.target.showPicker?.()}
                className="w-full bg-black/60 border border-white/15 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-white cursor-pointer [color-scheme:dark]"
              />
            </div>
          </div>

          <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs">
            <span className="text-white/60">Estimated Duration:</span>
            <span className="font-semibold text-white">
              {duration} {duration === 1 ? 'Working Day' : 'Working Days'}
            </span>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-white/60 mb-1.5">
              Reason for Request
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                setError('');
              }}
              placeholder="Briefly explain the nature of your leave..."
              className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-white resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-white/70 hover:text-white rounded-xl hover:bg-white/5 border border-white/10 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-medium text-black bg-white hover:bg-white/90 rounded-xl transition-all cursor-pointer font-semibold"
            >
              Submit Application
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default LeaveForm;
