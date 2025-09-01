const express = require('express')




exports.getProfile = async(req,res) => {
    try {

        const patient = req.patient

        res.status(200).json({
            name : patient.name,
            email : patient.email,
            age : patient.age,
            gender : patient.gender,
            phone: patient.phone,
            imgUrl : patient.imgUrl
        })

        
    } catch (error) {
        res.status(500).json({message: "Server Error", error: error.message });
    }
}


exports.editProfile = async(req,res) => {
    try {

        const patient = req.patient
        const updates = req.body

        if (req.file && req.file.path) {
          updates.imgUrl = req.file.path;
        }

        Object.keys(updates).forEach(key => {
            patient[key] = updates[key]
        })
     
        const updatedPatient = await patient.save();
         
         res.status(200).json({
            name : updatedPatient.name,
            email : updatedPatient.email,
            age : updatedPatient.age,
            gender : updatedPatient.gender,
            phone: updatedPatient.phone,
            imgUrl : updatedPatient.imgUrl
        })

        
    } catch (error) {
         res.status(500).json({message: "Failed to update profile", error: error.message });
    }
}

