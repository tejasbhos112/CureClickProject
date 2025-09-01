const appointmentModel = require("../models/appointmentModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


// to get booked appointments - (/doctor/appointment)
exports.getDoctorAppointments = async(req,res) => {
    try {
        const doctorId = req.doctor._id

        const appointments = await appointmentModel.find({doctorId})
        .populate("patientId","name email phone")

        res.status(200).json({
            message : "Doctor appointments fetched successfully!",
            appointments
        })
    } catch (error) {
        res.status(500).json({
          error: error.message,
        });
    }
}


//updating the status of a specific appointment (/doctor/appointment/:id/status)
exports.appointmentStatus = async(req,res) => {

   
       const {id} = req.params
       const {status} = req.body 

         const validStatuses = [
          "pending",
          "accepted",
          "rejected",
          "cancelled",
          "completed",
        ];

        if(!validStatuses.includes(status))
        {
             return res.status(400).json({ error: "Invalid status value" });
        }

 try {
    const appointment = await appointmentModel.findByIdAndUpdate(id,
        {status},
        {new:true}
    )

    if(!appointment)
    {
        return res.status(404).json({ error: "Appointment not found" });
    }

    res.status(200).json({ message: "Status updated", appointment });

 } catch (error) {
    console.error("Error updating appointment status:", error);
    res.status(500).json({ error: "Server error" });
 }
}

