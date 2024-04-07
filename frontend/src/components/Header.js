import { useLocation, Link } from "react-router-dom";
// routes
import {
    BLOGROUTE,
    ABOUTROUTE,
    DASHBOARDROUTE,
    LOGINROUTE,
    REGISTERROUTE,
    HOMEROUTE,
} from "../api";
// redux
import { useSelector } from "react-redux";
import { selectAuthStatus } from "../redux/authSlice";
// components
import NavItem from './NavItem';
import UserProfileIcon from "./UserIcon";

const Header = () => {
    const pathname = useLocation().pathname;
    const isLoggedin = useSelector(selectAuthStatus);

    return (
        <header className="bg-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link to={HOMEROUTE} className="text-red-500 text-3xl font-bold">
                    <div className="flex items-center gap-6">
                        Blood+
                    </div>
                </Link>

                <nav className="flex items-center gap-6">
                    <ul className="md:flex space-x-4 hidden mr-10">
                        <NavItem href={BLOGROUTE} isActive={pathname === BLOGROUTE}>Blog</NavItem>
                        <NavItem href={ABOUTROUTE} isActive={pathname === ABOUTROUTE}>About</NavItem>
                    </ul>
                    <ul className="flex space-x-4">
                        {isLoggedin && <NavItem href={DASHBOARDROUTE} isActive={pathname === DASHBOARDROUTE}>Dashboard</NavItem>}
                        {!isLoggedin && <NavItem href={LOGINROUTE} isActive={pathname === LOGINROUTE}>Login</NavItem>}
                        {!isLoggedin && <NavItem href={REGISTERROUTE} isActive={pathname === REGISTERROUTE}>Register</NavItem>}
                    </ul>
                    {isLoggedin && <UserProfileIcon />}
                </nav>
            </div>
        </header>
    );
};

export default Header;
