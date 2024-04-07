import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    displayOverlay: false
};

const bodyElem = document.querySelector('body');

export const globalComponent = createSlice({
    name: 'globalComponent',
    initialState,
    reducers: {
        displayOverlayContainer: (state) => {
            state.displayOverlay = true;
            bodyElem?.classList.add('overflow-hidden');
        },
        removeOverlayContainer: (state) => {
            state.displayOverlay = false;
            bodyElem?.classList.remove('overflow-hidden');
        },
    }
});

const appMessageInitial = {
    displayMessage: false,
    heading: null,
    text: null,
};

export const appMessage = createSlice({
    name: 'appMessage',
    initialState: appMessageInitial,
    reducers: {
        showMessage: (state, action) => {
            state.displayMessage = true;
            console.log(">>action", action.payload)
            state.heading = action.payload.heading;
            state.text = action.payload.text;
            console.log("after action", state.heading, state.text);
        },
        exitMessage: (state) => {
            state.displayMessage = false;
        }
    }
});

export const {
    displayOverlayContainer,
    removeOverlayContainer,
} = globalComponent.actions;

export const {
    showMessage,
    exitMessage
} = appMessage.actions;

export const globalComponentReducer = globalComponent.reducer;
export const appMessageReducer = appMessage.reducer;
