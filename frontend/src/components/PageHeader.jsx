import { ArrowRight, CalendarDays } from 'lucide-react';

const PageHeader = ({ children, className = '' }) => {
  const formattedDate = new Date().toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <div className={`flex items-center justify-between pb-1 border-b border-white/10 shrink-0 ${className}`}>
      <div className="flex flex-col">
        <div className="flex font-medium text-2xl lg:text-3xl items-center gap-2 text-white">
          <ArrowRight className="border-2 border-white rounded-lg p-0.5" size={24} />
          LEAVE IN
        </div>
        <span className="text-white/50 text-xs flex gap-1.5 items-center mt-0.5">
          <CalendarDays size={14} />
          Today's Date: {formattedDate}
        </span>
      </div>

      <div className="flex items-center gap-3">
        {children}
      </div>
    </div>
  );
};

export default PageHeader;
