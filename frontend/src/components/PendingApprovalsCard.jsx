import { ClipboardCheck } from 'lucide-react';
import StatCard from './StatCard';

const PendingApprovalsCard = ({ pendingCount = 5 }) => (
  <StatCard
    icon={ClipboardCheck}
    title="Pending Approvals"
    value={pendingCount}
    unit="Requests"
    className="bg-white/[0.06] border-white/15 hover:bg-white/[0.09]"
  />
);

export default PendingApprovalsCard;

