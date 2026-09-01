import SidebarButtons from "./SidebarButtons";

const SideBar = () => {
  const buttonData = [
    { id: 1, text: 'Dashboard', path: '/dashboard' },
    { id: 2, text: 'About Us', path: '/about' },
    { id: 3, text: 'Contact Us', path: '/contact' },
    { id: 4, text: 'Profile', path: '/profile' },
  ];

  return (
    <div className="py-5 bg-white/5 h-screen w-52 flex flex-col items-center">
      <img
        src="logo.svg"
        alt="Penthara Logo"
        className="bg-amber-50 py-5 px-2 w-30 rounded-xl mb-5"
      />

      <div className="w-full px-4 flex flex-col items-center gap-3">
        {buttonData.map((button) => (
          <SidebarButtons
            key={button.id}
            text={button.text}
            path={button.path}
          />
        ))}
      </div>
    </div>
  );
};

export default SideBar;
