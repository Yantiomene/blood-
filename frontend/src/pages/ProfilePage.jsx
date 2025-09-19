import { useLocation } from "react-router-dom";
import { ACCOUNTROUTE, HISTORYROUTE, PREFERENCES, PROFILEROUTE } from "../api";
import UpdateProfileForm from "../components/UpdateProfileForm";
import UserProfileIcon from "../components/userIcon";
import NavItem from "../components/navItem";
import AuthRequired from "../layouts/authRequired";

const navItemStyle = "block px-3 py-2 text-gray-800 transition hover:bg-white hover:text-red-600 active:bg-gray-200 rounded-md";
const navRoutes = [
    {
        route: PROFILEROUTE,
        text: 'Profile',
        tooltip: 'Profile',
        component: UpdateProfileForm
    },
    {
        route: ACCOUNTROUTE,
        text: 'Account',
        tooltip: 'Account',
        component: UpdateProfileForm
    },
    {
        route: PREFERENCES,
        text: 'Preferences',
        tooltip: 'Preferences',
        component: UpdateProfileForm
    },
    {
        route: HISTORYROUTE,
        text: 'History',
        tooltip: 'History',
        component: UpdateProfileForm
    }
];

const ProfilePage = () => {
    const params = useLocation().pathname;
    const routes = [PROFILEROUTE, HISTORYROUTE, PREFERENCES, ACCOUNTROUTE ];

    return (
        <>
        <div className="w-full h-[300px] p-10 bg-red-200">
            <UserProfileIcon /> {/* will later change to use a specialized component */}
        </div>
        <div className="offset-horizontal flex gap-2 p-4 bg-white rounded-lg">
            <nav className="account-page-nav w-1/4 max-w-fit rounded bg-gray-100">
                <ul className="md:flex flex-col gap-2 justify-between px-2 py-6">
                    {
                        navRoutes.map(({route, text, tooltip }, index) => (
                            <NavItem
                                key={index}
                                href={route}
                                text={tooltip} 
                                isActive={params === route}
                                className={navItemStyle} 
                                activeStyle="bg-red-200"
                            >{text}</NavItem>
                        ))
                    }
                </ul>
            </nav>
            <div className="w-[90vw] md:w-[40vw] min-h-[80vh]">
{
  routes.includes(params) && (() => {
    switch (params) {
      case PROFILEROUTE:
        return <UpdateProfileForm/>;
      case ACCOUNTROUTE:
        return <h1 className="bg-blue-400">Account</h1>;
      case PREFERENCES:
        return <h1 className="bg-blue-400">Preferences</h1>;
      case HISTORYROUTE:
        return <h1 className="bg-blue-400">History</h1>;
      default:
        return null; // This shouldn't happen due to routes.includes check
    }
  })()
}
            </div>
        </div>
        </>
    );
}

export default AuthRequired(ProfilePage);