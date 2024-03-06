import React from 'react';
import Header from '../components/Header';

const WithHeader = ({ children }) => {
    return (
        <>
            <Header />
            <main className='bg-gray-100'>
                {children}
            </main>
            <footer>
                <p>Footer</p>
            </footer>
        </>
    );
};

export default WithHeader;