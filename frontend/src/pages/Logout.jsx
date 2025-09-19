import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { unAuthenticateUser, validateAuthStatus } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import { logout } from "../api/user";
import { HOMEROUTE } from "../api";

export default function LogoutPage() {
    const router = useNavigate();
    const dispatch = useDispatch();
    const isLoggedIn = useSelector(validateAuthStatus);
    const [timeoutMessage, setTimeoutMessage] = useState("Logging out...");
    const [secondsLeft, setSecondsLeft] = useState(3);

    useEffect(() => {
        let interval;
        let redirectTimeout;
    
        if (isLoggedIn) {
            // Execute logout immediately without unnecessary setTimeout
            (async () => {
                try {
                    const response = await logout();
                    if (response.success) {
                        dispatch(unAuthenticateUser());
                        setTimeoutMessage("Logout successful. Redirecting...");
                        interval = setInterval(() => {
                            setSecondsLeft((prevSeconds) => (prevSeconds > 0 ? prevSeconds - 1 : 0));
                        }, 1000);
                        redirectTimeout = setTimeout(() => {
                            clearInterval(interval);
                            router(HOMEROUTE);
                        }, 3000);
                    } else {
                        setTimeoutMessage("Logout request failed.");
                    }
                } catch (error) {
                    console.error("Error logging out:", error);
                    setTimeoutMessage("An error occurred while logging out.");
                }
            })();
        } else {
            // will handle more cases where user is not logged in
            setTimeoutMessage("You're already logged out");
        }
    
        // Cleanup function to prevent memory leaks
        return () => {
            if (interval) clearInterval(interval);
            if (redirectTimeout) clearTimeout(redirectTimeout);
        };
    }, [dispatch, isLoggedIn, router]);

    return (
        <div className="mt-20 h-screen">
            <p className="text-3xl mb-4">{timeoutMessage}</p>
            {secondsLeft !== 0 && (
                <p className="text-sm text-gray-500">
                    You will be redirected in {secondsLeft} seconds...
                </p>
            )}
        </div>
    );
}
