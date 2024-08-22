import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    formData: {},

}

const registerFormDataSlice = createSlice({
    name: 'registerFormData',
    initialState,
    reducers: {
        setFormData : (state, action)=>{
            state.formData = action.payload
        }
    }
})

export const {setFormData} = registerFormDataSlice.actions;
export const registerFormDataReducer = registerFormDataSlice.reducer;
