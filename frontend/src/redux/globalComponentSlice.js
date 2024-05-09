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

export const {
    displayOverlayContainer,
    removeOverlayContainer,
} = globalComponent.actions;

export default globalComponent.reducer;
