import { Check, X, UserPlus, Mail, Calendar } from 'lucide-react'

const JoinRequestsModal = ({
  isOpen,
  onClose,
  requests = [],
  onApprove,
  onReject,
  loading = false
}) => {
  if (!isOpen) return null;

  const getInitials = (name = '') => {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Recently';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Recently';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-xl backdrop-blur-2xl bg-[#14151a] border border-white/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400">
              <UserPlus size={18} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
                Requests to Join
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {requests.length} Pending
                </span>
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Close">
            <X size={18} />
          </button>
        </div>

        {/* Requests List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {requests.length === 0 ? (
            <div className="py-10 text-center flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 mb-3">
                <Check size={20} />
              </div>
              <p className="text-sm font-medium text-white/80">No pending join requests</p>
            </div>
          ) : (
            requests.map((req) => (
              <div
                key={req.id || req._id}
                className="p-4 rounded-xl bg-white/[0.04] border border-white/10 hover:border-white/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                
                {/* Employee Profile Info */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#1A1A1A] border border-white/20 flex items-center justify-center text-white font-semibold text-xs shrink-0 mt-0.5">
                    {getInitials(req.name)}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-white">{req.name}</span>
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-white/10 border border-white/15 text-white/90">
                        {req.designation || 'Software Engineer'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-white/50">
                      <Mail size={12} className="shrink-0" />
                      <span className="font-mono text-[11px]">{req.email}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-white/40">
                      <Calendar size={11} className="shrink-0" />
                      <span>Applied: {formatDate(req.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Approve / Reject Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => onApprove(req.id || req._id)}
                    disabled={loading}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-[0.97] cursor-pointer disabled:opacity-50">
                    <Check size={13} strokeWidth={2.5} />
                    <span>Approve</span>
                  </button>

                  <button
                    onClick={() => onReject(req.id || req._id)}
                    disabled={loading}
                    className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-medium flex items-center gap-1.5 transition-all active:scale-[0.97] cursor-pointer disabled:opacity-50">
                    <X size={13} />
                    <span>Reject</span>
                  </button>
                </div>

              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

export default JoinRequestsModal;
