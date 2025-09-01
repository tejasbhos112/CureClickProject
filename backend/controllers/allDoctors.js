const express = require('express')
const Doctor = require("../models/doctorModel")

exports.getAllDoctors = async(req,res) => {
    
    try {
        const doctors = await Doctor.find().select(
          "name phone imgUrl speciality degree experience about fees isAvailable gender department ratings"
        );
       
        res.status(200).json(doctors)
   
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch doctors" });
    }
}

exports.getDoctorById = async (req,res) => {
    try {

       const doctor = await Doctor.findById(req.params.id) 

       if(!doctor)
       {
        return res.status(404).json({message: "Doctor not Found!"})
       }
       res.status(200).json(doctor)
        
    } catch (error) {
         res.status(500).json({ message: error.message });
    }
}