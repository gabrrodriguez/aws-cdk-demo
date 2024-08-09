import { Link } from "react-router-dom";
import { HiHome, HiClipboardList, HiUser, HiLogout } from "react-icons/hi";

const SupervisorNav = () => {
  return (
    <nav className="flex flex-col h-screen bg-gray-800 text-white">
      <div className="p-4">
        <ul className="flex flex-col space-y-4">
          <li className="flex items-center text-base md:text-lg lg:text-xl">
            <HiHome className="mr-2" />
            <Link to="/SupervisorDashboard">Dashboard</Link>
          </li>
          <li className="flex items-center text-base md:text-lg lg:text-xl">
            <HiClipboardList className="mr-2" />
            <Link to="/ListOfTasks">List of Tasks</Link>
          </li>
          <li className="flex items-center text-base md:text-lg lg:text-xl">
            <HiUser className="mr-2" />
            <Link to="/MyProfile">My Profile</Link>
          </li>
          <li className="flex items-center mt-auto text-base md:text-lg lg:text-xl">
            <HiLogout className="mr-2" />
            <span>Log out</span>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default SupervisorNav;