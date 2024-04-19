import { Link } from 'react-router-dom';

const buttonStyle = "text-slate-600 hover:text-red-600 px-3 py-2 hover:bg-slate-100 active:bg-slate-200 rounded-md transition duration-100";

const NavItem = (props) => {
  const {
    href,
    text = '',
    isActive,
    children,
    className = buttonStyle,
    activeStyle = 'bg-slate-100',
    // onClick=null
  } = props;
  return (
    <li
    // onClick={onClick && onClick}
    >
      <Link to={href} className={`${className} ${isActive && activeStyle}`} title={text && text}>
        {children}
      </Link>
    </li>
  );
};

export default NavItem;
