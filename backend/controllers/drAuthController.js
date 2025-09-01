const doctorModel = require("../models/doctorModel")
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')


exports.signupDoctor = async (req,res) => {
    try {

        const {name, email, password, department, gender, phone } = req.body

          if(!name || !email || !password || !department || !gender || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }
          
       const existingUser = await doctorModel.findOne({email}) 
       if(existingUser)
       {
        return res.status(400).json({ message: "Doctor already exists with this email." }); 
       }
        
       const hashedPassword = await bcrypt.hash(password,10)

       const doctor = new doctorModel({
            name,
            email,
            password: hashedPassword,
            department,
            gender,
            phone,
       })

       await doctor.save()

      const token = jwt.sign({_id:doctor._id}, process.env.JWT_SECRET,{
        expiresIn :"7d"
      }) 

      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "lax", // or 'none' if cross-site, with secure:true and HTTPS
        secure: false,   // true on HTTPS, false on localhost HTTP
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
      });
      
      res.status(201).json({token,data:doctor})
        
    } catch (error) {

        res.status(500).json({ message: "Registration failed", error: error.message });
    }
}


exports.loginDoctor = async (req, res) => {
    try {
        const {email, password} = req.body

        const doctor = await doctorModel.findOne({ email });
        if (!doctor)
        {
            return res.status(404).json({ message: "Doctor not found" });
        }

        const hashedPassword = await bcrypt.compare(password, doctor.password)
         
        if(!hashedPassword)
        {
             return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({_id:doctor._id},process.env.JWT_SECRET,{
            expiresIn : "7d"
        })

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "lax", // or 'none' if cross-site, with secure:true and HTTPS
            secure: false,   // true on HTTPS, false on localhost HTTP
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
          });
          
        res.status(200).json({token, data: doctor});

    } catch (error) {
         res.status(500).json({ message: "Login failed", error: error.message });
    }
}

exports.logoutDoctor = async(req,res) => {
    try {
        res.cookie("token", "", {
            httpOnly: true,
            expires: new Date(0),
            sameSite: "lax",
            secure: false,
          });
          

    res.status(200).json({ message: "Logged out successfully" });  
    } catch (error) {
        res.status(500).send("ERROR :" + error.message)
    }
}


