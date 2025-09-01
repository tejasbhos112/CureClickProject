const mongoose = require('mongoose')
const validator = require('validator')

const doctorSchema = mongoose.Schema({
     patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient"},
     name :{
        type : String,
        required : true
     },
        email : {
            type : String,
            required : true,
            unique : true,
            trim : true,
            validate(value) {
                if(! validator.isEmail(value)) {
                    throw new Error("Not a valid email"+ value)
                }
            }
        },
        password : {
            type : String,
            required : true,
            validate(value) {
                if(! validator.isStrongPassword(value))
                {
                    throw new Error("please enter strong password!!")
                }
            }
        },
        imgUrl : {
            type : String,
            default :"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRISuukVSb_iHDfPAaDKboFWXZVloJW9XXiwGYFab-QwlAYQ3zFsx4fToY9ijcVNU5ieKk&usqp=CAU",
            validate(value)
            {
                if(! validator.isURL(value))
                {
                      throw new Error("photoUrl is not valid"+ value)
                }
            }
        },
        phone : {
            type : String,
            validate(value)
            {
                if(! validator.isMobilePhone(value, "en-IN"))
                {
                    throw new Error("Invalid phone number");
                    
                }
            },
            required : true
        },
        gender : {
            type : String,
            enum : ["Male","Female","Other"],
            required : true
        },
        speciality : {
            type : String,
          
        },
        degree : {
            type : String,
          
        },
        experience : {
            type : String,
            
        },
        about : {
            type : String,
          
        },
        fees : {
            type : Number,
           
        },
         isAvailable: { 
            type: Boolean, 
           
        },
        age : {
            type : Number,

        },
        ratings: { 
            type: Number, 
            default: 0 
        },
        department : {
            type : String,
            enum : ['Cardiology','Orthopedics','Dermatology','General Medicine','Pediatrics'],
            required: true
        }
    
    },{timestamps: true})

    module.exports = mongoose.model("Doctor",doctorSchema)