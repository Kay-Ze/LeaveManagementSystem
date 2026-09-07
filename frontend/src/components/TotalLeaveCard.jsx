import { Layers } from 'lucide-react';
import StatCard from './StatCard';

const TotalLeaveCard = ({ total = 30 }) => (
  <StatCard
    icon={Layers}
    title="Total Leave Allocated"
    value={total}
    unit="Days"
  />
);

export default TotalLeaveCard;

