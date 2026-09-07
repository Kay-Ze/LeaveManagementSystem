import { CheckCircle2 } from 'lucide-react';
import StatCard from './StatCard';

const RemainingLeaveCard = ({ remaining = 22, breakdown, total = 30 }) => (
  <StatCard
    icon={CheckCircle2}
    title="Remaining Balance"
    value={remaining}
    unit="Days Left"
  >
    {breakdown && (
      <div className="flex items-center gap-1.5 pt-1.5 border-t border-white/10 text-[11px]">
        <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-white/70">
          Annual Leave: <strong className="text-white">{breakdown.annual ?? 18}</strong>
        </span>
        <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-white/70">
          Casual Leave: <strong className="text-white">{breakdown.casual ?? 8}</strong>
        </span>
        <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-white/70">
          Sick Leave: <strong className="text-white">{breakdown.sick ?? 4}</strong>
        </span>
      </div>
    )}
  </StatCard>
);

export default RemainingLeaveCard;

