import React from "react";
import { useLocation, Link } from "react-router-dom";
import { LOGINROUTE, REGISTERROUTE } from "../api";
import VerifyAlert from "../components/VerifyAlert";
import MessageAlert from "../components/messageAlert";
import Logo from "../components/logo";

const LinkClass = 'w-1/2 p-2 rounded-md text-center';

export default function WithoutHeader({ children }) {
    const params = useLocation().pathname;
    const routes = [LOGINROUTE, REGISTERROUTE];
    return (
        <>
            <VerifyAlert />
            <MessageAlert />
            <main className="flex flex-col items-center min-h-screen bg-gray-100">
                {
                    (routes.includes(params)) ?
                        <div className="mt-[8%]">
                            <Logo />
                            <div className='w-full h-[50px] p-2 my-2 flex items-center gap-10 bg-gray-200 rounded'>
                                <Link
                                    className={LinkClass + `${(params === LOGINROUTE) ? ' bg-red-400' : ' bg-gray-200'}`}
                                    to={LOGINROUTE}
                                >Login
                                </Link>
                                <Link
                                    className={LinkClass + `${(params === REGISTERROUTE) ? ' bg-red-400' : ' bg-gray-200'}`}
                                    to={REGISTERROUTE}
                                >Register
                                </Link>
                            </div>
                            {children}
                        </div>
                        :
                        children
                }
            </main>
        </>
    );
};
