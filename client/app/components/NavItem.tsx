import Link from 'next/link';

interface NavItemProps {
    href: string;
    isActive: boolean;
    children: React.ReactNode;
}  

const NavItem: React.FC<NavItemProps> = ({ href, isActive, children }) => {
    return (
      <li>
        <Link href={href} className={`text-white ${isActive ? 'font-bold' : ''}`}>
            {children}
        </Link>
      </li>
    );
  };
  
export default NavItem;