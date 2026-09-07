import { Check, X } from 'lucide-react';

const StatusBadge = ({ status }) => {
  if (status === 'Pending') {
    return (
      <span className="inline-flex items-center gap-1.5 bg-amber-400/10 text-amber-200 border border-amber-400/25 px-2.5 py-0.5 rounded-full text-[11px] font-medium">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
        Pending
      </span>
    );
  }

  if (status === 'Approved') {
    return (
      <span className="inline-flex items-center gap-1.5 bg-[#FAF8F5] text-black px-2.5 py-0.5 rounded-full text-[11px] font-semibold shadow-sm">
        <Check size={11} strokeWidth={3} />
        Approved
      </span>
    );
  }

  if (status === 'Rejected') {
    return (
      <span className="inline-flex items-center gap-1.5 bg-white/5 text-white/40 border border-white/10 px-2.5 py-0.5 rounded-full text-[11px]">
        <X size={11} />
        Rejected
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] text-white/60 bg-white/5">
      {status}
    </span>
  );
};

export default StatusBadge;
