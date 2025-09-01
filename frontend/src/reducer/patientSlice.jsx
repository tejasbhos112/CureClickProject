import { createSlice } from "@reduxjs/toolkit";

const savedData = JSON.parse(localStorage.getItem("data"));
console.log("Initial patientSlice state loaded from localStorage:", savedData);

const initialState = savedData || {
  name: null,
  email: null,
  phone: null,
  age: null,
  gender: null,
  imgUrl: null,
  
};

const patientSlice = createSlice({
  name: "patient",
  initialState,
  reducers: {
    addPatient: (state, action) => {
      console.log("addPatient reducer - action.payload:", action.payload);
      localStorage.setItem("data", JSON.stringify(action.payload));
      console.log("addPatient reducer - localStorage 'data' after setItem:", localStorage.getItem("data"));

      return action.payload;
    },
    removePatient: () => {
      localStorage.removeItem("data");
      return {
        name: null,
        email: null,
        phone: null,
        age: null,
        gender: null,
        imgUrl: null,
      };
    },
  },
});

export const { addPatient, removePatient } = patientSlice.actions;
export default patientSlice.reducer;
