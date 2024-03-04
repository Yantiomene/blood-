"use client";

import Header from "@/app/components/Header";

export default function BlogLandingPage() {
    return (
        <>
            <h1 className="text-4xl font-bold mb-4">Welcome to My Blog</h1>
            <p className="text-lg text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl id lacinia lacinia, nunc nunc tincidunt nunc, id lacinia nunc nunc id nunc.</p>
            <div className="grid grid-cols-3 gap-4 mt-8">
                {/* Render blog posts here */}
            </div>
        </>
    );
};
