const express = require('express')
const router = express.Router()
const {upload} = require("../utils/cloudinary")
const {doctorAuth} = require('../middlewares/auth')
const {getDoctorProfile, editDoctorProfile} = require('../controllers/drProfileController')
const {getAllDoctors, getDoctorById} = require("../controllers/allDoctors")

router.get("/profile",doctorAuth,getDoctorProfile)
router.patch("/profile",doctorAuth,upload.single('imgUrl'),editDoctorProfile)

router.get("/all", getAllDoctors )
router.get("/details/:id",getDoctorById )

module.exports = router

