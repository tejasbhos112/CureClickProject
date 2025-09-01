const Appointment = require("../models/appointmentModel");

const cancelAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const patientId = req.patient.id; 

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (appointment.patientId.toString() !== patientId) {
      return res
        .status(403)
        .json({ message: "Not authorized to cancel this appointment" });
    }

    appointment.status = "cancelled";
    await appointment.save();

    res.status(200).json({ message: "Appointment cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling appointment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getPatientAppointments = async (req, res) => {
  try {
    const patientId = req.patient.id; 

    const appointments = await Appointment.find({ patientId: patientId })
      .populate("doctorId", "name department imgUrl") 
      .sort({ createdAt: -1 });

    res.status(200).json({ appointments });
  } catch (error) {
    console.error("Error fetching patient appointments:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  cancelAppointment,
  getPatientAppointments
};
