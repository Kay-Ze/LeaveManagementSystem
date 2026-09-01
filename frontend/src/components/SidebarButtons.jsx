import { Link } from "react-router-dom";

const SidebarButtons = ({ text, path }) => {
  return (
    <Link
      to={path}
      className="w-full bg-amber-300 text-black font-medium rounded-lg h-10 flex items-center justify-center no-underline hover:bg-amber-200 transition-colors"
    >
      {text}
    </Link>
  );
};

export default SidebarButtons;
