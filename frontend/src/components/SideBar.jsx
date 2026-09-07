import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SidebarButtons from "./SidebarButtons";
import { LogOut } from 'lucide-react'
import { logoutUser, getCurrentUser } from "../services/authService";

const SideBar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => getCurrentUser() || {
    name: 'John Doe',
    initials: 'JD',
    designation: 'Sr. Engineer',
    role: 'employee'
  });

  useEffect(() => {
    const u = getCurrentUser();
    if (u) setUser(u);
  }, []);

  const buttonData = [
    { id: 1, text: 'Dashboard', path: user?.role === 'admin' ? '/admin' : '/dashboard' }
  ];

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <div className="pb-3 pt-10 bg-[#F5F2EB] h-screen w-70 flex flex-col items-center rounded-r-3xl justify-between">
      <div className="flex flex-col gap-10 items-center w-full">
        <img
          src="/logo.svg"
          alt="Penthara Logo"
          className="py-5 px-5 w-5/6 rounded-xl mb-5"
        />

        <div className="w-full pl-4 flex flex-col items-center gap-3">
          {buttonData.map((button) => (
            <SidebarButtons
              key={button.id}
              text={button.text}
              path={button.path}
            />
          ))}
        </div>
      </div>

      <div className="w-5/6 h-12 bg-transparent flex items-center justify-between border border-t-gray-500 border-x-transparent border-b-transparent">
        <div className="flex gap-3 items-center">
          <h2 className="px-2 py-1 rounded-full bg-[#1A1A1A] text-white text-xs font-medium">
            {user.initials || 'JD'}
          </h2>
          <div>
            <h1 className="text-black text-sm font-semibold">{user.name}</h1>
            <p className="text-black/60 text-[11px]">{user.designation || 'Engineer'}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          title="Sign Out"
          className="p-1.5 rounded-lg text-black/60 hover:text-black transition-colors cursor-pointer"
        >
          <LogOut size={16} />
        </button>
      </div>
    </div>
  );
};

export default SideBar;
