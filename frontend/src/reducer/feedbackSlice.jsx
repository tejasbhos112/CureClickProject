
import { createSlice } from "@reduxjs/toolkit";

const feedbackParseData = localStorage.getItem("reduxFeed")
const parsedData = JSON.parse(feedbackParseData)
console.log("parsed data",parsedData);


 const initialState = parsedData || {
     feedbacks : []
    }

const feedbackSlice = createSlice({
    name : "feedback",
    initialState,
   
    reducers : {

        addFeedback : (state,action) => {
             
              
                    state.feedbacks.push({
                        id: Date.now(),
                        rating : action.payload.rating,
                        text : action.payload.text,
                        author : action.payload.author,
                        date: new Date().toLocaleDateString(),
                        doctorId : action.payload.doctorId

                    })
                  localStorage.setItem("reduxFeed",JSON.stringify(state))
                
        }

    }
})

export const {addFeedback} = feedbackSlice.actions; 
export default feedbackSlice.reducer