const express = require('express')
const router = express.Router();
const {patientAuth} = require("../middlewares/auth")
const {addReviews,getReviews, getTopReviews} = require("../controllers/reviewController")

//patient should be login
router.post("/",patientAuth, addReviews)


router.get("/top", getTopReviews)

router.get("/:doctorId",getReviews)


module.exports = router;
