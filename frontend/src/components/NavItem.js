import { Link } from 'react-router-dom';

const buttonStyle = "px-3 py-2 hover:bg-gray-100 active:bg-gray-200 rounded-md transition";

const NavItem = ({ href, isActive, children }) => {
  return (
    <li>
      <Link to={href} className={`text-gray-600 hover:text-red-600 ${buttonStyle} ${isActive && ' bg-gray-100'}`}>
        {children}
      </Link>
    </li>
  );
};

export default NavItem;
