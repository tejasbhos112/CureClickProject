
const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
    doctorId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Doctor",
            required : true
        },
        patientId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Patient",
            required : true
        },
        rating : {
            type : Number,
            min:1,
            max:5
        },
        review : String
},{ timestamps: true})


module.exports = mongoose.model("Review", reviewSchema)