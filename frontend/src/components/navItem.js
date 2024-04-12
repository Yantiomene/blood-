import { Link } from 'react-router-dom';

const buttonStyle = "text-gray-600 hover:text-red-600 px-3 py-2 hover:bg-gray-100 active:bg-gray-200 rounded-md transition";

const NavItem = ({ href, text='', isActive, children, className=buttonStyle, activeStyle='bg-gray-100' }) => {
  return (
    <li>
      <Link to={href} className={`${className} ${isActive && activeStyle }`} title={text && text}>
        {children}
      </Link>
    </li>
  );
};

export default NavItem;
