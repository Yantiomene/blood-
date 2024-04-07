import { Link } from 'react-router-dom';

const NavItem = ({ href, isActive, children }) => {
  return (
    <li>
      <Link to={href} className={`text-gray-900 hover:text-red-600 ${isActive ? 'opacity-60 font-bold' : ''}`}>
        {children}
      </Link>
    </li>
  );
};

export default NavItem;
