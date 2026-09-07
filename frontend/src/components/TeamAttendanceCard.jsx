import { CheckCircle2 } from 'lucide-react';
import StatCard from './StatCard';

const TeamAttendanceCard = () => (
  <StatCard
    icon={CheckCircle2}
    title="Team Attendance"
    value="92%"
    className="bg-white/[0.06] border-white/15 hover:bg-white/[0.09]"
  >
    <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
      <span className="text-emerald-400 font-medium">Present: 42</span>
      <span className="text-white/40">•</span>
      <span className="text-rose-400 font-medium">Absent: 3</span>
      <span className="text-white/40">•</span>
      <span className="text-white/60">Total: 45</span>
    </div>
  </StatCard>
);

export default TeamAttendanceCard;
