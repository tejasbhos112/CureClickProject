const express = require('express')



exports.getDoctorProfile = async (req,res) => {
    try {
        const doctor = req.doctor
        
        res.status(200).json({
          name: doctor.name,
          email: doctor.email,
          phone: doctor.phone,
          gender: doctor.gender,
          department: doctor.department,
          imgUrl: doctor.imgUrl,
          speciality: doctor.speciality,
          degree: doctor.degree,
          experience: doctor.experience,
          about: doctor.about,
          fees: doctor.fees,
          age: doctor.age,
          isAvailable: doctor.isAvailable,
          ratings: doctor.ratings,
          createdAt: doctor.createdAt,
          updatedAt: doctor.updatedAt,
        });

    } catch (error) {
              res.status(500).json({ message: "Failed to fetch doctor profile", error: error.message });
    }
}


exports.editDoctorProfile = async (req,res) => {
    try {
        const doctor = req.doctor
        const updatedInfo = req.body
        
        const allowedFields = [
            "name", "phone", "imgUrl", "speciality", "degree",
            "experience", "about", "fees", "isAvailable", "gender", "department","age"
        ]

        Object.keys(updatedInfo).forEach((key)=>{
            if(allowedFields.includes(key)) {
                doctor[key] = updatedInfo[key]
            }
        })
        
        if (req.file && req.file.path) {
          doctor.imgUrl = req.file.path; // This will be Cloudinary URL
        }


        const updatedDoctor = await doctor.save();
console.log(req.body.age);
        res.status(200).json({
            name: updatedDoctor.name,
            email: updatedDoctor.email,
            phone: updatedDoctor.phone,
            gender: updatedDoctor.gender,
            department: updatedDoctor.department,
            imgUrl: updatedDoctor.imgUrl,
            speciality: updatedDoctor.speciality,
            degree: updatedDoctor.degree,
            experience: updatedDoctor.experience,
            about: updatedDoctor.about,
            fees: updatedDoctor.fees,
            isAvailable: updatedDoctor.isAvailable,
            ratings: updatedDoctor.ratings,
            age:updatedDoctor.age
        })

    } catch (error) {
        res.status(500).json({message:"Failed to update profile!", error:error.message})
    }
}