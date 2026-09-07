import { useState, useId } from 'react'
import { Eye, EyeOff } from 'lucide-react'

const AuthInput = ({
  type = 'text',
  placeholder = '',
  value = '',
  onChange,
  icon: Icon,
  required = false
}) => {
  const inputId = useId();
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  return (
    <div
      className="relative border-b border-white/25 focus-within:border-white transition-colors pb-1">
      <div className="flex items-center justify-between">
        <input
          id={inputId}
          type={isPassword ? (showPassword ? 'text' : 'password') : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="w-full bg-transparent border-0 px-0 py-2 text-sm text-white placeholder:text-zinc-400 focus:outline-none"
        />

        <div className="flex items-center gap-2 text-zinc-400 shrink-0">
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="hover:text-white transition-colors cursor-pointer">
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          )}

          {Icon && <Icon size={16} />}
        </div>
      </div>
    </div>
  )
}

export default AuthInput
