"use client";

import Header from "../components/Header";
import { useSelector } from "react-redux";

export default function AboutPage() {
    const auth = useSelector((state: any) => state.auth.isAuth);
    console.log(">> auth: ", auth);
    return (
        <>
        <Header isLoggedin={auth} />
        <main className="container mx-auto py-10 min-h-screen">
            <section className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-4">About Blood+</h1>
                <p className="text-gray-700 text-lg mb-6">
                    Blood+ is a platform designed to improve timely access to safe blood by connecting donors, hospitals, and patients.
                    We help coordinate requests, streamline communication, and share stories from the community.
                </p>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="p-4 rounded border border-gray-200 bg-white">
                        <h2 className="text-xl font-semibold mb-2">Our Mission</h2>
                        <p className="text-gray-700">Support healthcare providers and patients with reliable blood access through informed donors and transparent coordination.</p>
                    </div>
                    <div className="p-4 rounded border border-gray-200 bg-white">
                        <h2 className="text-xl font-semibold mb-2">For Donors</h2>
                        <p className="text-gray-700">Discover donation opportunities, receive guidance, and track the impact of your contributions.</p>
                    </div>
                    <div className="p-4 rounded border border-gray-200 bg-white">
                        <h2 className="text-xl font-semibold mb-2">For Hospitals</h2>
                        <p className="text-gray-700">Coordinate requests, manage conversations, and keep donors informed when supplies are needed most.</p>
                    </div>
                </div>

                <div className="p-4 rounded border border-gray-200 bg-white mb-8">
                    <h2 className="text-xl font-semibold mb-2">What You Can Do</h2>
                    <ul className="list-disc pl-5 text-gray-700 space-y-1">
                        <li>Become a donor and share eligibility details</li>
                        <li>Follow stories and updates on our <a href="/site/blog" className="text-red-700 underline">Blog</a></li>
                        <li>Coordinate requests securely with hospitals via your dashboard</li>
                    </ul>
                </div>

                <div className="p-4 rounded border border-gray-200 bg-white">
                    <h2 className="text-xl font-semibold mb-2">Contact</h2>
                    <p className="text-gray-700">Have questions or feedback? Reach us at <a href="mailto:support@bloodplus.example" className="text-red-700 underline">support@bloodplus.example</a>.</p>
                </div>
            </section>
        </main>
        </>
    );
};