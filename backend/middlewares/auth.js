const patientModel = require('../models/patientModel')
const doctorModel = require("../models/doctorModel")
const jwt = require('jsonwebtoken')


const patientAuth = async (req,res,next) =>{
    try {
        
        const {token} = req.cookies
        console.log("Token recieved from cookie:", token);

        if(!token)
        {
            return res.status(401).send("please login")
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

        //to find patient
        const {_id} = decodedToken

        const patient = await patientModel.findById(_id)

        if(!patient)
        {
             return res.send("patient is not found!!")
        }

        req.patient = patient
        next()
        

    } catch (error) {
         res.status(400).send("ERROR:"+error.message)
    }
}

const doctorAuth = async(req,res,next) => {
    try {
        
        const {token} = req.cookies
         console.log("Token recieved from cookie:", token);

          if(!token)
        {
            return res.status(401).json({ message: "Please login" });
        }

         const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
         
         const {_id} = decodedToken

         const doctor = await doctorModel.findById(_id)

          if (!doctor) {
            return res.status(401).json({ message: "Doctor not found" });
          }
         req.doctor = doctor
         next()

    } catch (error) {
          res.status(400).send("ERROR:"+error.message)
    }
}

// General auth middleware for chat system that works with both patients and doctors
const auth = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            return res.status(401).json({ message: "Please login" });
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const { _id } = decodedToken;

        // Try to find patient first
        let patient = await patientModel.findById(_id);
        if (patient) {
            req.user = { userId: patient._id, userType: "patient" };
            return next();
        }

        // If not patient, try to find doctor
        let doctor = await doctorModel.findById(_id);
        if (doctor) {
            req.user = { userId: doctor._id, userType: "doctor" };
            return next();
        }

        // If neither found
        return res.status(401).json({ message: "User not found" });

    } catch (error) {
        console.error("Auth error:", error);
        res.status(400).json({ message: "Authentication error: " + error.message });
    }
};

module.exports={
    patientAuth,
    doctorAuth,
    auth
}