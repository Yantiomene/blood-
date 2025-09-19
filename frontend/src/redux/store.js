import { configureStore } from '@reduxjs/toolkit';
import userSlice from './userSlice';
import { appMessageReducer } from './globalComponentSlice';

const saveState = (state) => {
    try {
        // Only persist non-sensitive data
        const stateToPersist = {
          user: {
            username: state.user?.username,
            email: state.user?.email,
            isDonor: state.user?.isDonor,
            sessionExpireDate: state.user?.sessionExpireDate,
            // Exclude sensitive fields like tokens, passwords, etc.
          },
          // Don't persist appMessage as it's transient UI state
        };
        const serializedState = JSON.stringify(stateToPersist);
        localStorage.setItem('bplus', serializedState);
        const parsedState = JSON.parse(serializedState);
        const sessionExpireDate = parsedState?.user?.sessionExpireDate;
        if (sessionExpireDate && new Date().getTime() > new Date(sessionExpireDate).getTime()) {
            console.log(">> session expired", new Date().getTime(), JSON.parse(serializedState).sessionExpireDate);
        }
    } catch (error) {
        console.error('Error saving state to localStorage:', error);
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
        return JSON.parse(serializedState);
    } catch (error) {
        console.error('Error loading state from localStorage:', error);
import { configureStore } from '@reduxjs/toolkit';
import userSlice from './userSlice';
import { appMessageReducer } from './globalComponentSlice';
import { throttle } from 'lodash';

// Throttle saves to at most once per second
const throttledSaveState = throttle((state) => {
  saveState(state);
}, 1000);

store.subscribe(() => {
    throttledSaveState(store.getState());
});

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
