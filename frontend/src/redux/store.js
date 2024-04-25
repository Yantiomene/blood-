import { configureStore } from '@reduxjs/toolkit';
import userSlice from './userSlice';
import { appMessageReducer } from './globalComponentSlice';

const saveState = (state) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('bplus', serializedState);
    } catch (error) {
        console.error('Error saving state to localStorage:', error);
    }
};

const loadState = () => {
    try {
        const serializedState = localStorage.getItem('bplus');
        if (serializedState === null) {
            return undefined;
        }
        if (new Date().getTime() > JSON.parse(serializedState).sessionExpireDate) {
            console.log(">> session expired", new Date().getTime(), JSON.parse(serializedState).sessionExpireDate);
            localStorage.removeItem('bplus');
            return undefined;
        }
        return JSON.parse(serializedState);
    } catch (error) {
        console.error('Error loading state from localStorage:', error);
        return undefined;
    }
};

const persistedState = loadState();
const store = configureStore({
  reducer: {
    user: userSlice,
    appMessage: appMessageReducer,
  },
  preloadedState: persistedState, // Initialize with persisted state
});

store.subscribe(() => {
    saveState(store.getState());
});

export default store;
