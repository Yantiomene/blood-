import { useLocation } from "react-router-dom";
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
import { validateAuthStatus } from "../redux/userSlice";
// components
import NavItem from './navItem';
import UserProfileIcon from "./userIcon";
import Logo from "./logo";

const Header = () => {
    const pathname = useLocation().pathname;
    const isLoggedin = useSelector(validateAuthStatus);

    return (
        <header className="bg-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Logo/>

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
