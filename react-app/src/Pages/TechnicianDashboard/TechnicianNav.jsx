import { Link, Outlet } from "react-router-dom";
import { HiHome, HiClipboardList, HiUser, HiLogout } from "react-icons/hi";

const TechnicianNav = () => {
  return (
    <div className="flex">
      <nav className="flex flex-col h-screen bg-gray-800 text-white">
        <div className="p-6 flex-grow">
          <ul className="flex flex-col space-y-4">
            <li className="flex items-center text-base md:text-lg lg:text-xl">
              <HiHome className="mr-2" />
              <Link to="/technician">Dashboard</Link>
            </li>
            <li className="flex items-center text-base md:text-lg lg:text-xl">
              <HiClipboardList className="mr-2" />
              <Link to="/technician/tasks">List of Tasks</Link>
            </li>
            <li className="flex items-center text-base md:text-lg lg:text-xl">
              <HiUser className="mr-2" />
              <Link to="/technician/profile">My Profile</Link>
            </li>
          </ul>
        </div>
        <div className="p-4">
          <li className="flex items-center text-base md:text-lg lg:text-xl">
            <HiLogout className="mr-2" />
            <Link to="/">Log out</Link>
          </li>
        </div>
      </nav>
      <div className="flex-grow">
        <Outlet />
      </div>
    </div>
  );
};

export default TechnicianNav;