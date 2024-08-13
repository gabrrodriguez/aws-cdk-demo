import NavLink from "../Components/NavLink";
import { Link, Outlet } from "react-router-dom";
import { HiHome, HiClipboardList, HiUser, HiLogout } from "react-icons/hi";

const TechnicianLayout = () => {
  return (
    <div className="flex">
      <nav className="flex flex-col h-screen bg-gray-800 text-white">
        <div className="p-6 flex-grow">
          <ul className="flex flex-col space-y-4">
            {/* TODO need to change this to supervisor Dash */}
            <NavLink to="/technician" icon={<HiHome className="mr-2" />}>
              Dashboard
            </NavLink>
            <NavLink to="/technician/tasks" icon={<HiClipboardList className="mr-2" />}>
              List of Tasks
            </NavLink>
            <NavLink to="/technician/profile" icon={<HiUser className="mr-2" />}>
              My Profile
            </NavLink>
          </ul>
        </div>
        <div className="p-4">
          <li className="flex items-center text-base md:text-lg lg:text-xl">
            <HiLogout className="mr-2" />
            <Link to="logout">Log out</Link>
          </li>
        </div>
      </nav>
      <div className="flex-grow">
        <Outlet />
      </div>
    </div>
  );
};

export default TechnicianLayout;