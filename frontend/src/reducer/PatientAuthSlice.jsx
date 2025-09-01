import { createSlice } from "@reduxjs/toolkit"

const token = localStorage.getItem("PatienToken");

const initialState = {
  email: null,
  token: token || null,
  error: null,
  isAuthenticated: !!token,
};

const PatientAuthSlice = createSlice({
    name : "patientAuth",
    initialState,
    reducers : {

        login : (state,action) => {
            state.email = action.payload.email;
            state.token = action.payload.token;
            localStorage.setItem("PatienToken",action.payload.token)
            state.isAuthenticated = true;
            state.error = null;

        },
        logout : (state, action) => {
               
            state.email = null;
            state.token = null;
            localStorage.removeItem("PatienToken")
            state.isAuthenticated = false;
            state.error = null;
            
        },
    
    }
})

export const {login, logout} = PatientAuthSlice.actions;
export default PatientAuthSlice.reducer;