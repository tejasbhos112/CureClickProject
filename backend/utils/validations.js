const validator = require('validator')

const validateSignuUpData = (req) => {

    const {name,email,password} = req.body

    if(!name)
    {
         throw new Error("empty names not allowed!!!");
    }

    else if (!validator.isEmail(email))
    {
        throw new Error("Email is not valid!");
        
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Please enter a stronger password");
        
    }
}


module.exports = {
    validateSignuUpData
}