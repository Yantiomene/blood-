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
        if (isLoggedIn) {
            setTimeout(async () => {
                try {
                    const response = await logout();
                    if (response.success) {
                        dispatch(unAuthenticateUser());
                        setTimeoutMessage("Logout successful. Redirecting...");
                        const interval = setInterval(() => {
                            setSecondsLeft((prevSeconds) => (prevSeconds > 0 ? prevSeconds - 1 : 0));
                        }, 1000);
                        setTimeout(() => {
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
            }, 0);
        } else {
            // Handle case where user is not logged in
            setTimeoutMessage("You are not logged in.");
        }
    }, [dispatch, router]);

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
