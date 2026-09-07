const RoleToggle = ({
  roles = [
    { label: 'Admin', value: 'admin' },
    { label: 'Employee', value: 'employee' }
  ],
  activeRole = 'employee',
  onSelect
}) => {
  return (
    <div
      className="flex items-center justify-center gap-6 border-b border-white/10">
      {roles.map((role) => {
        const isActive = activeRole === role.value;
        return (
          <button
            key={role.value}
            type="button"
            onClick={() => onSelect(role.value)}
            className={`text-xs uppercase tracking-wider pb-2 font-medium transition-colors cursor-pointer ${
              isActive
                ? 'border-b-2 border-white text-white'
                : 'text-white/40 hover:text-white/70'
            }`}>
            {role.label}
          </button>
        );
      })}
    </div>
  )
}

export default RoleToggle
