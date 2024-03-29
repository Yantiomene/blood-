import React from 'react';
import Image from "next/image";
import { useSelector } from 'react-redux';
import Header from '../components/Header';

const Banner: React.FC = () => {
    const auth = useSelector((state: any) => state.auth.isAuth);
    console.log(">> auth: ", auth)
    return (
        <>
            <Header isLoggedin={auth} />
            <div className="pt-10">
                <h1 className="text-center">Welcome To Blood+, a digital resource for blood access and donations</h1>
                <section >
                    <Image
                        src="/blood_donor.jpg"
                        width={800}
                        height={400}
                        alt="Blood Donation"
                        className="mx-auto mt-10 w-[80%] rounded-lg"
                    />
                </section>
            </div>
        </>
    )

}


export default Banner;