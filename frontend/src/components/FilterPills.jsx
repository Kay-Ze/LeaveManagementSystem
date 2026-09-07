const FilterPills = ({ options = ['All', 'Pending', 'Approved', 'Rejected'], active, onChange }) => (
  <div className="flex items-center gap-1 p-0.5 bg-black/40 border border-white/10 rounded-xl text-xs self-start sm:self-auto">
    {options.map((opt) => (
      <button
        key={opt}
        type="button"
        onClick={() => onChange(opt)}
        className={`px-2.5 py-0.5 rounded-lg transition-colors cursor-pointer text-xs ${
          active.toLowerCase() === opt.toLowerCase()
            ? 'bg-white text-black font-medium'
            : 'text-white/60 hover:text-white'
        }`}
      >
        {opt}
      </button>
    ))}
  </div>
);

export default FilterPills;
