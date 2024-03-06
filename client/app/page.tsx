"use client";

import { Provider } from 'react-redux';
import store from './redux/store';
import Banner from "./components/Banner";

export default function Home() {
  return (
    <Provider store={store}>
      <Banner />
    </Provider>
  );
}
