import { Link, useLocation } from "react-router-dom";

const SidebarButtons = ({ text, path }) => {
  const location = useLocation();
  const currentPath = location.pathname.toLowerCase();
  const targetPath = path.toLowerCase();

  const isDashboard = text.toLowerCase() === 'dashboard' && (
    currentPath === '/dashboard' ||
    currentPath === '/admin' ||
    currentPath === '/admin/dashboard' ||
    currentPath === '/'
  );

  const isActive = isDashboard || currentPath === targetPath;

  return (
    <Link
      to={path}
      className={`w-full font-medium text-sm rounded-l-full h-10 flex items-center justify-center no-underline transition-all ${
        isActive
          ? "bg-[#1A1A1A] text-white font-semibold shadow-md"
          : "text-black"
      }`}
    >
      {text}
    </Link>
  );
};

export default SidebarButtons;
