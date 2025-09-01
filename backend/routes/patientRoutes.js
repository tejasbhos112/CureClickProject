const express = require('express')
const router = express.Router()

const {getProfile,editProfile} = require("../controllers/profileController")
const {patientAuth} = require("../middlewares/auth")
const {cancelAppointment, getPatientAppointments} = require("../controllers/patientAppointmentController")

const {upload} = require("../utils/cloudinary")



router.get("/profile",patientAuth, getProfile)
router.patch("/profile",patientAuth,upload.single('imgUrl'), editProfile)
router.put("/appointment/cancel/:id", patientAuth, cancelAppointment)
router.get("/appointment", patientAuth, getPatientAppointments)


module.exports = router;