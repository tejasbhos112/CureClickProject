const express = require('express')
const router = express.Router()
const {patientAuth} = require("../middlewares/auth")

const {
  bookAppointment,
  getAppointmentOfPatient,
} = require("../controllers/AppointmentsController");



router.get("/", patientAuth, getAppointmentOfPatient);
router.post("/book",patientAuth,bookAppointment)


module.exports=router