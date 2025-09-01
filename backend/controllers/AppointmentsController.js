const appointmentModel = require("../models/appointmentModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// to book appointment (POST /patient/appointment/book)
exports.bookAppointment = async(req,res) => {

    try {
         const patientId = req.patient._id;
        const {doctorId,date,time,type,reason} = req.body

        const newAppointment = new appointmentModel({
            patientId,
            doctorId,
            date,
            time,
            type,
            reason
        })

        await newAppointment.save();

        res.status(200).json({
          message: "Appointment booked",
          appointment:newAppointment
        });

    } catch (error) {
        res.status(500).json({
          message: "Failed to book appointment",
          error: error.message,
        });
        
    }
}



// to get booked appointments (/patient/appointment)
exports.getAppointmentOfPatient = async(req,res) => {
    try {

        const patientId = req.patient._id

        const appointments = await appointmentModel.find({patientId})
        .populate("doctorId", "name department phone email imgUrl")
        .sort({date:-1})

         res.status(200).json({
           message: "Appointments fetched successfully",
           appointments,
         });
        
    } catch (error) {
        res.status(500).json({
          message: "Failed to fetch appointments",
          error: error.message,
        });
    }
}


