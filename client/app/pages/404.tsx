"use client";

import Header from "../components/Header";
import { useSelector } from "react-redux";

export default function FourZeroFour() {
    const auth = useSelector((state: any) => state.auth);

    return (
        <>
            {/* <Header isLoggedin={auth.isAuth()}/> */}
            <h1 className="text-2xl font-bold mb-4">404 page</h1>
            <p className="text-lg">
                Are you lost? keep searching...
                {/* will put information about app, developers, etc... */}
            </p>
        </>
    );
};