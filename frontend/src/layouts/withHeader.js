import React from 'react';
import Header from '../components/Header';
import VerifyAlert from '../components/VerifyAlert';

const WithHeader = ({ children }) => {
    return (
        <>
            <VerifyAlert />
            <Header />
            <main className='bg-gray-100'>
                {children}
            </main>
            <footer className='bg-gray-900 text-white min-h-[100px] p-4 text-center'>
                <div className="py-10 px-[10%]">
                    <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
                    <p className="text-lg">
                        Contact us at{" "}
                        <a href="mailto:help@bloodplus.com" className="text-red-500">
                            help@bloodplus.com
                        </a>
                    </p>
                </div>
                <div>
                    &copy; {new Date().getFullYear()} Blood+
                    <p className='text-xs mt-2'>All rights reserved</p>
                </div>
            </footer>
        </>
    );
};

export default WithHeader;