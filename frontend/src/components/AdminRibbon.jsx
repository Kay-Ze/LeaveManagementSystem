import { Bell } from 'lucide-react';
import PageHeader from './PageHeader';

const AdminRibbon = ({ pendingJoinCount = 0, onOpenJoinRequests }) => (
  <PageHeader>
    <button
      type="button"
      onClick={onOpenJoinRequests}
      title={pendingJoinCount > 0 ? `${pendingJoinCount} pending join request${pendingJoinCount > 1 ? 's' : ''}` : 'Notifications'}
      className="relative p-2 text-white/70 hover:text-white rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all cursor-pointer"
    >
      <Bell size={18} />
      {pendingJoinCount > 0 && (
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] flex items-center justify-center font-bold shadow-sm animate-pulse">
          {pendingJoinCount}
        </span>
      )}
    </button>
  </PageHeader>
);

export default AdminRibbon;

