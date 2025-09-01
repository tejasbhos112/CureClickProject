const mongoose = require('mongoose')
const validator = require('validator')

const userSchema =new mongoose.Schema({
    name : String,
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
       
    },
    gender : {
        type : String,
        enum : ["Male","Female","Other"],
        
    },
    age : {
        type : Number,
    },
    address : {
        type : String,
    },
   
  

},{timestamps: true})


module.exports = mongoose.model("Patient",userSchema)