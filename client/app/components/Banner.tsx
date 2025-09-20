import React from 'react';
import Image from "next/image";
import Link from "next/link";
import { useSelector } from 'react-redux';
import Header from '../components/Header';

const Banner: React.FC = () => {
    const auth = useSelector((state: any) => state.auth.isAuth);
    console.log(">> auth: ", auth)
    return (
        <>
            <Header isLoggedin={auth} />
            <div className="pt-10">
                <h1 className="text-center text-2xl md:text-3xl font-semibold">Welcome To Blood+, a digital resource for blood access and donations</h1>
                <section>
                    <Image
                        src="/blood_donor.jpg"
                        width={800}
                        height={400}
                        alt="Blood Donation"
                        className="mx-auto mt-10 w-[80%] rounded-lg"
                    />
                </section>
                <section className="max-w-3xl mx-auto mt-8 px-4 text-center">
                    <p className="text-gray-700 leading-relaxed">
                        Safe blood saves lives. Many countries still face seasonal shortages, and regular voluntary donations are vital to ensure timely access for patients in need.
                    </p>
                    <div className="mt-6">
                        <Link href="/site/blog" className="inline-block bg-red-700 hover:bg-red-800 text-white px-5 py-2 rounded-md transition-colors">
                            Read stories and updates on our Blog
                        </Link>
                    </div>
                </section>
            </div>
        </>
    )
}

export default Banner;