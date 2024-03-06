"use client";

import React from 'react';
import { Provider } from 'react-redux';
import store from '@/app/redux/store';
import BlogLandingPage from '@/app/pages/blog';
import AboutPage from '@/app/pages/about';
import FourZeroFour from '@/app/pages/404';

const OtherPage = ({ params }: { params: { site: string } }) => {

    return (
        <Provider store={store}>
            {
                (params.site === 'blog') ? <BlogLandingPage /> : 
                (params.site === 'about') ? <AboutPage /> : <FourZeroFour/>
            }
        </Provider>
    );
};

export default OtherPage;