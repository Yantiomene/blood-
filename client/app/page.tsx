"use client";

import { Provider } from 'react-redux';
import store from './redux/store';
import Banner from "./components/Banner";

export default function Home() {
  return (
    <Provider store={store}>

      <footer className="text-center mt-8 text-gray-600 text-sm">
        &copy; 2024 EsmondYanintheGreg. All rights reserved.
      </footer>

      <Banner />
    </Provider>
  );
}
