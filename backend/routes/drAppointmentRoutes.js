const express = require('express')
const router = express.Router()
const {doctorAuth} = require("../middlewares/auth")
const {getDoctorAppointments, appointmentStatus} = require("../controllers/drAppointmentController");

router.get("/", doctorAuth, getDoctorAppointments);
router.patch("/:id/status",doctorAuth,appointmentStatus)


module.exports = router