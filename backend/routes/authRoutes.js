const express = require('express')
const router = express.Router()
const {signup, login, logout} = require("../controllers/authControllers")
const {signupDoctor,loginDoctor,logoutDoctor} = require("../controllers/drAuthController")

router.post("/patient/signup", signup)
router.post("/patient/login", login)
router.post("/patient/logout",logout)


router.post("/doctor/signup",signupDoctor)
router.post("/doctor/login",loginDoctor)
router.post("/doctor/logout",logoutDoctor)

module.exports = router;