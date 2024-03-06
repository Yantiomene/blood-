import React from 'react';
import Header from '../components/Header';

const WithHeader = ({ children }) => {
    return (
        <>
            <Header />
            {children}

            <footer>
                <p>Footer</p>
            </footer>
        </>
    );
};

export default WithHeader;