import { createSlice } from "@reduxjs/toolkit";

const token = localStorage.getItem('token')

const initialState = {
    isLogin: token ? true : false,
    token: localStorage.getItem('token'),
    user: JSON.parse(localStorage.getItem('user'))
}

const loginSlice = createSlice({
    name: 'loginSlice',
    initialState,
    reducers: {
        login: (state, action)=>{
            localStorage.setItem('token', action.payload.token);
            localStorage.setItem('user', JSON.stringify(action.payload.user));
            state.isLogin =  true;
            state.user = action.payload.user;
        },
        logout: (state, action)=>{
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            state.isLogin = false;
            state.user = {};
        }
    }
})

export const {login, logout} = loginSlice.actions;
export const loginReducer = loginSlice.reducer