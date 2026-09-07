import { Clock } from 'lucide-react';
import StatCard from './StatCard';

const TakenLeaveCard = ({ taken = 8 }) => (
  <StatCard
    icon={Clock}
    title="Leaves Taken"
    value={taken}
    unit="Days"
  />
);

export default TakenLeaveCard;

