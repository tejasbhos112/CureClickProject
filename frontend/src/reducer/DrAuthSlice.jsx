import { createSlice } from "@reduxjs/toolkit"

const token = localStorage.getItem("DoctorToken");
const initialState = {
    email : null,
    token : token,
    error : null,
    isAuthenticated : !!token,
}

const DrAuthSlice = createSlice({
    name : "auth",
    initialState,
    reducers : {

        login : (state,action) => {
             state.email = action.payload.email;
            state.token = action.payload.token;
            localStorage.setItem("DoctorToken",action.payload.token)
            state.isAuthenticated = true;
            state.error = null;

        },
        logout : (state, action) => {
               
            state.email = null;
            state.token = null;
            localStorage.removeItem("DoctorToken")
            state.isAuthenticated = false;
            state.error = null;
            
        }
    
    }
})

export const {login, logout} = DrAuthSlice.actions;
export default DrAuthSlice.reducer;