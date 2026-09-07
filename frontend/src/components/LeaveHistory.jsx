import { useState } from 'react';
import { Calendar, HeartPulse, Briefcase } from 'lucide-react';
import StatusBadge from './StatusBadge';
import FilterPills from './FilterPills';

const LeaveHistory = ({ records = [], className = '' }) => {
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredRecords = records.filter((item) => {
    if (activeFilter === 'All') return true;
    return item.status.toLowerCase() === activeFilter.toLowerCase();
  });

  const getLeaveIcon = (type = '') => {
    const lower = type.toLowerCase();
    if (lower.includes('sick')) return <HeartPulse size={14} />;
    if (lower.includes('casual')) return <Calendar size={14} />;
    return <Briefcase size={14} />;
  };

  return (
    <div className={`backdrop-blur-2xl bg-white/10 border border-white/20 rounded-2xl p-4 shadow-xl flex flex-col overflow-hidden ${className || 'mx-10 mt-4 flex-1 min-h-0'}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 shrink-0 pb-1">
        <h2 className="text-base font-semibold text-white tracking-tight">
          Recent Leave Applications & Status
        </h2>

        <FilterPills
          active={activeFilter}
          onChange={setActiveFilter}
        />
      </div>

      <div className="overflow-x-auto overflow-y-auto flex-1 min-h-0 mt-2 no-scrollbar">
        <table className="w-full text-left text-sm border-collapse min-w-[650px]">
          <thead className="sticky top-0 bg-[#1e1e1e] z-10">
            <tr className="border-b border-white/10 text-[10px] uppercase tracking-wider text-white/40">
              <th className="pb-2 pt-1 font-medium">Leave Type</th>
              <th className="pb-2 pt-1 font-medium">Dates</th>
              <th className="pb-2 pt-1 font-medium">Duration</th>
              <th className="pb-2 pt-1 font-medium">Reason</th>
              <th className="pb-2 pt-1 font-medium">Applied On</th>
              <th className="pb-2 pt-1 font-medium">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/5">
            {filteredRecords.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-8 text-center text-xs text-white/40">
                  No leave records found under this filter.
                </td>
              </tr>
            ) : (
              filteredRecords.map((item) => (
                <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-2 sm:py-2.5 flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white">
                      {getLeaveIcon(item.leaveType)}
                    </div>
                    <span className="font-medium text-white text-xs sm:text-sm">{item.leaveType}</span>
                  </td>

                  <td className="py-2 sm:py-2.5 text-white/80 text-xs">
                    {item.startDate} {item.endDate !== item.startDate && `to ${item.endDate}`}
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
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaveHistory;

