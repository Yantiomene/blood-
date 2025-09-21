import React from 'react';
import Image from "next/image";
import Link from "next/link";
import { useSelector } from 'react-redux';
import Header from '../components/Header';
import BloodTransfer3D from '../components/BloodTransfer3D';

const BloodDrop = () => (
  <svg width="180" height="220" viewBox="0 0 180 220" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="mx-auto">
    <defs>
      <radialGradient id="g" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stopColor="#ffb3b3"/>
        <stop offset="60%" stopColor="#e11d48"/>
        <stop offset="100%" stopColor="#7f1d1d"/>
      </radialGradient>
      <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#7f1d1d" floodOpacity="0.25"/>
      </filter>
    </defs>
    <g filter="url(#shadow)">
      <path d="M90 10 C 110 50, 140 90, 150 130 C 160 180, 120 210, 90 210 C 60 210, 20 180, 30 130 C 40 90, 70 50, 90 10 Z" fill="url(#g)">
        <animateTransform attributeName="transform" type="rotate" from="0 90 130" to="360 90 130" dur="9s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.95;1;0.95" dur="3s" repeatCount="indefinite"/>
      </path>
      <circle cx="70" cy="90" r="10" fill="#fff" opacity="0.35">
        <animate attributeName="opacity" values="0.2;0.4;0.2" dur="2.5s" repeatCount="indefinite"/>
      </circle>
    </g>
  </svg>
);

const WelcomeMessage: React.FC = () => (
  <div className="mt-4 text-center">
    <p className="text-lg md:text-xl font-semibold">
      Together we connect donors with patients — your gift can travel to someone in need today.
    </p>
    <p className="text-base md:text-lg text-gray-700 mt-2">
      Welcome To Blood+, a digital resource for blood access and donations
    </p>
  </div>
);

const Banner: React.FC = () => {
    const auth = useSelector((state: any) => state.auth.isAuth);
    return (
        <>
            <Header isLoggedin={auth} />
            <section className="pt-10">
                <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center px-6">
                    <div className="order-2 md:order-1">
                        <h1 className="text-3xl md:text-4xl font-bold leading-tight">Your trusted platform for blood access and donation coordination</h1>
                        <p className="mt-4 text-gray-700 leading-relaxed">
                            Safe blood saves lives. Many countries still face seasonal shortages, and regular voluntary donations are vital to ensure timely access for patients in need.
                        </p>
                        <div className="mt-6 flex gap-3">
                            <Link href="/site/blog" className="inline-block bg-red-700 hover:bg-red-800 text-white px-5 py-2 rounded-md transition-colors">Read stories on our Blog</Link>
                            <Link href="/register" className="inline-block bg-white text-red-700 border border-red-300 hover:bg-red-50 px-5 py-2 rounded-md">Become a donor</Link>
                        </div>
                    </div>
                    <div className="order-1 md:order-2 flex flex-col items-center">
                        <BloodDrop />
                        <BloodTransfer3D />
                        <WelcomeMessage />
                        <Image src="/blood_donor.jpg" width={720} height={400} alt="Blood Donation" className="mt-6 w-full rounded-lg shadow" />
                    </div>
                </div>
            </section>
        </>
    )
}

export default Banner;