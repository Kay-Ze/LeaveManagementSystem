const StatCard = ({ icon: Icon, title, value, unit, extraHeader, children, className = '' }) => (
  <div className={`backdrop-blur-2xl bg-white/10 border border-white/20 rounded-xl p-3.5 sm:p-4 relative overflow-hidden group hover:bg-white/[0.14] hover:border-white/30 transition-all flex flex-col justify-between ${className}`}>
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {Icon && (
          <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center text-white">
            <Icon size={14} />
          </div>
        )}
        <span className="text-[11px] font-semibold uppercase tracking-wider text-white/60">
          {title}
        </span>
      </div>
      {extraHeader}
    </div>

    <div className="my-2">
      <div className="text-2xl lg:text-3xl font-bold tracking-tight text-white">
        {value} {unit && <span className="text-sm font-normal text-white/50">{unit}</span>}
      </div>
    </div>

    {children}
  </div>
);

export default StatCard;
