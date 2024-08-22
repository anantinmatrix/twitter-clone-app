import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    show: false,
    content: '',
    type: null
}

const notificationSlice = createSlice({
    name: 'notificationSlice',
    initialState,
    reducers: {
        showNotification: (state, action)=>{
            state.show = true;
            state.content = action.payload.content;
            state.type = action.payload.type;
        },
        hideNotification: (state, action)=>{
            state.show = false;
            state.content = '';
            state.type = null;
        }
    }
})

export const { showNotification, hideNotification } = notificationSlice.actions;

export const notificationReducer =  notificationSlice.reducer;