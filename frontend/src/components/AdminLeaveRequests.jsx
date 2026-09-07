import { useState } from 'react';
import { Check, X, Search } from 'lucide-react';
import StatusBadge from './StatusBadge';
import FilterPills from './FilterPills';

const AdminLeaveRequests = ({ records = [], onApprove, onReject, className = '' }) => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const pendingCount = records.filter((r) => r.status === 'Pending').length;

  const filteredRecords = records.filter((item) => {
    const selected = activeFilter.startsWith('Pending') ? 'Pending' : activeFilter;
    const matchesStatus = selected === 'All' || item.status.toLowerCase() === selected.toLowerCase();

    // Search query filter
    const employeeName = item.employee?.name?.toLowerCase() || '';
    const employeeRole = item.employee?.role?.toLowerCase() || '';
    const reason = item.reason?.toLowerCase() || '';
    const query = searchQuery.toLowerCase().trim();

    const matchesSearch =
      !query ||
      employeeName.includes(query) ||
      employeeRole.includes(query) ||
      reason.includes(query);

    return matchesStatus && matchesSearch;
  });

  return (
    <div
      className={`backdrop-blur-2xl bg-white/[0.06] border border-white/15 rounded-2xl p-4 shadow-xl flex flex-col overflow-hidden ${className || 'mx-10 mt-4 flex-1 min-h-0'}`}>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2 shrink-0 pb-1">
        <div>
          <h2 className="text-base font-semibold text-white tracking-tight">
            Employee Leave Requests & Approvals
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search size={13} className="absolute left-2.5 top-2 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search employee..."
              className="bg-black/50 border border-white/10 rounded-xl pl-8 pr-3 py-1 text-xs text-white placeholder-white/40 focus:outline-none focus:border-white/30 w-40 sm:w-52"
            />
          </div>

          <FilterPills
            options={['All', `Pending (${pendingCount})`, 'Approved', 'Rejected']}
            active={activeFilter}
            onChange={setActiveFilter}
          />
        </div>
      </div>

      <div className="overflow-x-auto overflow-y-auto flex-1 min-h-0 mt-2 no-scrollbar">
        <table className="w-full text-left text-sm border-collapse min-w-[750px]">
          <thead className="sticky top-0 bg-[#1e1e1e] z-10">
            <tr className="border-b border-white/10 text-[10px] uppercase tracking-wider text-white/40">
              <th className="pb-2 pt-1 font-medium">Employee</th>
              <th className="pb-2 pt-1 font-medium">Leave Type</th>
              <th className="pb-2 pt-1 font-medium">Dates</th>
              <th className="pb-2 pt-1 font-medium">Duration</th>
              <th className="pb-2 pt-1 font-medium">Reason</th>
              <th className="pb-2 pt-1 font-medium">Applied On</th>
              <th className="pb-2 pt-1 font-medium">Status</th>
              <th className="pb-2 pt-1 font-medium text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/5">
            {filteredRecords.length === 0 ? (
              <tr>
                <td colSpan="8" className="py-8 text-center text-xs text-white/40">
                  No leave requests found.
                </td>
              </tr>
            ) : (
              filteredRecords.map((item) => (
                <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-2 sm:py-2.5 flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-[#1A1A1A] border border-white/20 flex items-center justify-center text-white text-[11px] font-semibold shrink-0">
                      {item.employee?.initials || 'EM'}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-white text-xs">
                        {item.employee?.name || 'Employee'}
                      </span>
                      <span className="text-white/50 text-[10px]">
                        {item.employee?.role || 'Staff'} • {item.employee?.balance ?? 14}d left
                      </span>
                    </div>
                  </td>

                  <td className="py-2 sm:py-2.5 font-medium text-white text-xs">
                    {item.leaveType}
                  </td>

                  <td className="py-2 sm:py-2.5 text-white/80 text-xs">
                    {item.startDate} to {item.endDate}
                  </td>

                  <td className="py-2 sm:py-2.5 text-white/70 text-xs">
                    {item.duration} {item.duration === 1 ? 'Day' : 'Days'}
                  </td>

                  <td className="py-2 sm:py-2.5 text-white/60 text-xs max-w-xs truncate">
                    {item.reason}
                  </td>

                  <td className="py-2 sm:py-2.5 text-white/50 text-xs">
                    {item.appliedOn}
                  </td>

                  <td className="py-2 sm:py-2.5">
                    <StatusBadge status={item.status} />
                  </td>

                  <td className="py-2 sm:py-2.5 text-right">
                    {item.status === 'Pending' ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onApprove(item.id)}
                          title="Approve Request"
                          className="p-1 bg-white text-black hover:bg-white/90 rounded-lg transition-all cursor-pointer shadow-sm">
                          <Check size={13} strokeWidth={2.5} />
                        </button>
                        <button
                          type="button"
                          onClick={() => onReject(item.id)}
                          title="Reject Request"
                          className="p-1 border border-white/20 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all cursor-pointer">
                          <X size={13} strokeWidth={2.5} />
                        </button>
                      </div>
                    ) : (
                      <span className="text-white/40 text-xs font-medium pr-2">
                        Completed
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  )
}

export default AdminLeaveRequests;

