import { createSlice } from "@reduxjs/toolkit";

const savedData = JSON.parse(localStorage.getItem("doctorData"))

const initialState = savedData || {
    email : null,
    password : null,
   
}

const doctorSlice = createSlice({
    name : "doctor",
    initialState,
    reducers : {

        
        addDoctor : (state,action) =>
        {
            localStorage.setItem("doctorData", JSON.stringify(action.payload));
            return action.payload
        },
        removeDoctor : (state,action) => {
            localStorage.removeItem("doctorData")
           return {
            name: null,
            email: null,
          
      };
        },
       

}})

export const {addDoctor, removeDoctor} = doctorSlice.actions
export default doctorSlice.reducer;
