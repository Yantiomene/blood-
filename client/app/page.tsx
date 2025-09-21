"use client";

import { Provider } from 'react-redux';
import store from './redux/store';
import Banner from "./components/Banner";

export default function Home() {
    return (
        <>
        <Provider store={store}>
            <main className="min-h-screen flex flex-col">
                <Banner/>
                <footer className="text-center mt-auto text-gray-600 text-sm py-6">
                    &copy; 2024 Blood+. All Rights Reserved.
                </footer>
            </main>
        </Provider>
        </>
    )
}
