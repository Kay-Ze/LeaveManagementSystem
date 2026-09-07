import { useState, useId } from 'react'
import { useNavigate } from 'react-router-dom'
import { RotateCw, LogOut } from 'lucide-react'
import { getCurrentUser, checkUserStatus, logoutUser } from '../services/authService'

const WaitingApprovalPage = () => {
  const navigate = useNavigate();
  const [user] = useState(() => getCurrentUser());
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleReload = async () => {
    if (!user?.email) {
      navigate('/login', { replace: true });
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const res = await checkUserStatus(user.email);
      if (res?.status === 'approved') {
        navigate('/dashboard', { replace: true });
      } else {
        setMessage('Your request is still awaiting admin approval.');
      }
    } catch {
      setMessage('Unable to verify status. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-black text-white flex flex-col items-center justify-center px-4 select-none">
      <div className="max-w-md w-full text-center space-y-6">
        
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-white tracking-tight">
            Waiting for Admin Approval
          </h1>
          <p className="text-sm text-white/60">
            Your request has been submitted. Once an administrator approves your account, reload to continue.
          </p>
        </div>

        {message && (
          <div className="text-xs text-amber-300/90 bg-amber-500/10 border border-amber-500/20 py-2 px-3 rounded-lg">
            {message}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={handleReload}
            disabled={loading}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white text-black font-medium text-xs flex items-center justify-center gap-2 hover:bg-white/90 transition-all cursor-pointer disabled:opacity-50"
          >
            <RotateCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>{loading ? 'Checking...' : 'Reload'}</span>
          </button>

          <button
            onClick={() => {
              logoutUser();
              navigate('/login', { replace: true });
            }}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white/70 hover:text-white border border-white/10 text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <LogOut size={14} />
            <span>Sign In with another account</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default WaitingApprovalPage;
