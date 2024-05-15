import { configureStore } from '@reduxjs/toolkit';
import userSlice from './userSlice';
import donationRequestSlice from './donationSlice';
import { appMessageReducer } from './globalComponentSlice';

const USER_LOCAL_STORAGE_KEY = 'bplus_user';

const saveState = (state) => {
    try {
        const userState = {
            user: state.user
        };

        const serializedState = JSON.stringify(userState);
        const expirationTime = new Date().getTime() + 3600000; // 1 hour
        const dataToStore = { data: serializedState, expireTime: expirationTime };

        localStorage.setItem(USER_LOCAL_STORAGE_KEY, JSON.stringify(dataToStore));
    } catch (error) {
        console.error('Error saving state to localStorage:', error);
    }
};

const loadState = () => {
    try {
        const serializedState = localStorage.getItem(USER_LOCAL_STORAGE_KEY);
        if (serializedState === null) {
            return undefined;
        }
        const storedData = JSON.parse(serializedState);
        if (new Date().getTime() > storedData.expireTime) {
            console.log(">> session expired", new Date().getTime(), storedData.expireTime);
            localStorage.removeItem(USER_LOCAL_STORAGE_KEY);
            return undefined;
        }
        return JSON.parse(storedData.data);
    } catch (error) {
        console.error('Error loading state from localStorage:', error);
        return undefined;
    }
};

const store = configureStore({
    reducer: {
        user: userSlice,
        donationRequestList: donationRequestSlice,
        appMessage: appMessageReducer,
    },
    preloadedState: loadState(),
});

store.subscribe(() => {
    saveState(store.getState());
});

export default store;
