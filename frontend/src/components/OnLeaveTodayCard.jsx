import { Clock } from 'lucide-react';
import StatCard from './StatCard';

const OnLeaveTodayCard = ({ count = 3 }) => (
  <StatCard
    icon={Clock}
    title="On Leave Today"
    value={count}
    unit="Employees"
    className="bg-white/[0.06] border-white/15 hover:bg-white/[0.09]"
  />
);

export default OnLeaveTodayCard;

