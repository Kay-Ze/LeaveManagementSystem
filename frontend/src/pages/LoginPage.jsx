import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, User, Loader2, ArrowRight, Briefcase } from 'lucide-react'
import AuthInput from '../components/AuthInput'
import RoleToggle from '../components/RoleToggle'
import { loginUser, registerUser, isValidPentharaEmail } from '../services/authService'

const LoginPage = () => {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [role, setRole] = useState('employee');
  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      setError('Please provide both email and password.');
      return;
    }

    if (isRegister && !name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    if (isRegister && role === 'employee' && !designation.trim()) {
      setError('Please enter your designation.');
      return;
    }

    // Strict validation: must be @penthara.ai email
    if (!isValidPentharaEmail(email)) {
      setError('Access restricted: Only @penthara.ai email addresses are authorized (e.g. name@penthara.ai).');
      return;
    }

    try {
      setLoading(true);
      setError('');

      let user;
      if (isRegister) {
        user = await registerUser(name, email, password, role, designation);
      } else {
        user = await loginUser(email, password, role);
      }

      if (user?.role === 'employee' && (user?.status === 'pending' || user?.pendingApproval)) {
        navigate('/waiting-approval');
      } else {
        navigate(user?.role === 'admin' ? '/admin' : '/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsRegister(!isRegister);
    setError('');
  };

  return (
    <div
      className="min-h-screen bg-[#07080a] text-zinc-100 flex flex-col justify-between relative overflow-x-hidden selection:bg-white/20 selection:text-white">

      {/* Cinematic Background Image */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <img
          src="/login_background.png"
          alt="Atmospheric Background"
          className="w-full h-full object-cover object-center filter brightness-[0.88] contrast-[1.05]"
        />
        {/* Shadow only on the right side to keep login card readable while landscape remains bright */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/20 to-black/85" />
      </div>

      <header
        className="relative z-30 w-full px-6 sm:px-12 lg:px-16 pt-8 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg border border-white/20 bg-white/10 flex items-center justify-center backdrop-blur-sm">
            <ArrowRight size={16} className="text-white" />
          </div>
          <span className="font-bold tracking-[0.18em] text-white text-base uppercase">
            LEAVE IN
          </span>
        </div>
      </header>

      <main
        className="relative z-10 w-full px-6 sm:px-10 lg:pl-16 lg:pr-20 flex-1 flex flex-col lg:flex-row items-center justify-between gap-8 py-6">

        {/* Brand Logo in the Sky (Horizontally centered in remaining space) */}
        <div className="hidden lg:flex flex-1 flex-col items-center justify-center self-start pt-2 select-none">
          <div className="w-[420px] xl:w-[480px] h-[115px] xl:h-[130px] flex items-center justify-center rounded-3xl bg-black/40 border border-white/20 backdrop-blur-sm shadow-[0_25px_60px_rgba(0,0,0,0.7)] hover:border-white/35 transition-all">
            <img
              src="/logo.svg"
              alt="Penthara Technologies"
              className="h-16 xl:h-20 w-auto object-contain brightness-0 invert opacity-90 drop-shadow-[0_2px_18px_rgba(255,255,255,0.25)]"
            />
          </div>
        </div>

        <section
          className="w-full lg:w-auto shrink-0 flex flex-col items-center lg:items-end justify-center my-auto">
          <div
            className="w-full sm:w-[380px] backdrop-blur-2xl bg-black/55 border border-white/20 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.85)] p-7 sm:p-8 relative">

            <div className="text-center pt-2 pb-6">
              <h1 className="text-2xl sm:text-[28px] font-semibold tracking-tight text-white mb-6">
                {isRegister ? 'Sign Up' : 'Login'}
              </h1>

              <RoleToggle
                activeRole={role}
                onSelect={setRole}
              />
            </div>

            {error && (
              <div className="mb-4 text-xs text-red-400 bg-red-950/30 border border-red-500/20 px-3 py-2 rounded-xl text-center leading-relaxed">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {isRegister && (
                <AuthInput
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  icon={User}
                  required
                />
              )}

              {isRegister && role === 'employee' && (
                <AuthInput
                  type="text"
                  placeholder="Designation (e.g. Frontend Developer)"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  icon={Briefcase}
                  required
                />
              )}

              <AuthInput
                type="email"
                placeholder="name_here@penthara.ai"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={Mail}
                required
              />

              <AuthInput
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={Lock}
                required
              />

              <div className="flex items-center justify-between text-xs pt-1 text-zinc-300">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded bg-white/10 border-white/30 text-white accent-white cursor-pointer"
                  />
                  <span>Remember me</span>
                </label>

                {!isRegister && (
                  <button
                    type="button"
                    className="hover:text-white text-zinc-300 transition-colors cursor-pointer">
                    Forgot Password?
                  </button>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#181920]/90 hover:bg-[#23242e] text-white border border-white/20 font-medium text-sm py-3 px-4 rounded-xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 backdrop-blur-sm">
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>{isRegister ? 'Creating Account...' : 'Authenticating...'}</span>
                    </>
                  ) : (
                    <span>
                      {isRegister ? 'Sign Up' : 'Login'} as {role === 'admin' ? 'Admin' : 'Employee'}
                    </span>
                  )}
                </button>
              </div>

              <div className="text-center pt-2 text-xs text-zinc-400">
                {isRegister ? (
                  <span>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={toggleAuthMode}
                      className="text-white hover:underline font-medium cursor-pointer ml-1">
                      Sign In
                    </button>
                  </span>
                ) : (
                  <span>
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={toggleAuthMode}
                      className="text-white hover:underline font-medium cursor-pointer ml-1">
                      Sign Up
                    </button>
                  </span>
                )}
              </div>
            </form>

          </div>

          <div className="w-full sm:w-[380px] text-center pt-4 text-zinc-400 text-[11px] tracking-widest uppercase">
            LeaveIn Interactive © 2025
          </div>
        </section>

      </main>

    </div>
  )
}

export default LoginPage
