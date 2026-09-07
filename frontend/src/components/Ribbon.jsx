import { Plus } from 'lucide-react';
import PageHeader from './PageHeader';

const Ribbon = ({ onApplyLeave, className = '' }) => (
  <PageHeader className={className}>
    <button
      type="button"
      onClick={onApplyLeave}
      className="bg-[#F5F2EB] text-black flex items-center px-3 py-1.5 gap-1.5 rounded-xl hover:bg-[#F5F2EB]/90 font-medium text-xs sm:text-sm shadow-md transition-all cursor-pointer"
    >
      <Plus strokeWidth={2.5} size={16} />
      Apply For Leave
    </button>
  </PageHeader>
);

export default Ribbon;

