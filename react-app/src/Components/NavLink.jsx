import { Link } from "react-router-dom";
import PropTypes from 'prop-types';

const NavLink = ({ to, icon, children }) => {
  return (
    <li className="flex items-center text-base md:text-lg lg:text-xl">
      {icon}
      <Link to={to}>{children}</Link>
    </li>
  );
};

NavLink.propTypes = {
    to: PropTypes.string.isRequired,
    icon: PropTypes.node,
    children: PropTypes.node.isRequired,
  };

export default NavLink;