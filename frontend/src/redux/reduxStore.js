import {configureStore} from '@reduxjs/toolkit'
import { registerFormDataReducer } from './slices/registerFormSlice';
import { notificationReducer } from './slices/notificationSlice';
import { loginReducer } from './slices/loginSlice';

const store = configureStore({
    reducer: {
        registerFormData : registerFormDataReducer,
        notificationSlice: notificationReducer,
        loginSlice : loginReducer
    }
})

export default store;
