import { configureStore } from '@reduxjs/toolkit';
import userSlice from './userSlice';
import { appMessageReducer } from './globalComponentSlice';

import { configureStore } from '@reduxjs/toolkit';
import userSlice from './userSlice';
import { appMessageReducer } from './globalComponentSlice';
import { throttle } from 'lodash';

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
        const parsedState = JSON.parse(serializedState);
        const sessionExpireDate = parsedState?.user?.sessionExpireDate;
        if (sessionExpireDate && new Date().getTime() > new Date(sessionExpireDate).getTime()) {
            console.log(">> session expired", new Date().getTime(), parsedState.user.sessionExpireDate);
            localStorage.removeItem('bplus');
            return undefined;
        }
        return parsedState;
    } catch (error) {
        console.error('Error loading state from localStorage:', error);
        return undefined;
    }
};
// Throttle saves to at most once per second
const throttledSaveState = throttle((state) => {
  saveState(state);
}, 1000);

const persistedState = loadState();
const store = configureStore({
  reducer: {
    user: userSlice,
    appMessage: appMessageReducer,
  },
  preloadedState: persistedState, // Initialize with persisted state
});

store.subscribe(() => {
    throttledSaveState(store.getState());
});

export default store;
