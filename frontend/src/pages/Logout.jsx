import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { unAuthenticateUser } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";
import { logout } from "../api/user";
import { HOMEROUTE } from "../api";
import WithoutHeader from "../layouts/withoutHeader";

export default function LogoutPage() {
    const router = useNavigate();
    const dispatch = useDispatch();
    const [timeoutMessage, setTimeoutMessage] = useState("Logging out...");
    const [secondsLeft, setSecondsLeft] = useState(5);

    useEffect(() => {
        const interval = setInterval(() => {
            setSecondsLeft((prevSeconds) => (prevSeconds > 0 ? prevSeconds - 1 : 0));
        }, 1000);

        setTimeout(async () => {
            try {
                const response = await logout();
                if (response.success) {
                    localStorage.setItem("isAuth", "false");
                    dispatch(unAuthenticateUser());
                    router(HOMEROUTE);
                }
            } catch (error) {
                console.error("Error logging out:", error);
                setTimeoutMessage("An error occurred while logging out.");
            }
        }, secondsLeft * 1000);

        return () => clearInterval(interval);
    }, [dispatch, secondsLeft, router]);

    return (
        <WithoutHeader>
            <div className="mt-20 h-screen">
                <p className="text-3xl mb-4">{timeoutMessage}</p>
                <p className="text-sm text-gray-500">
                    You will be redirected in {secondsLeft} seconds...
                </p>
            </div>
        </WithoutHeader>
    );
}
