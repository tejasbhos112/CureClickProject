const express = require('express')
const reviewModel = require("../models/reviewModel")

const addReviews = async (req,res) => {
    try {
        const {doctorId, rating, review} = req.body

        if (!doctorId || !rating || !review) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newReview = await reviewModel.create({
        doctorId,
        rating,
        review,
        patientId : req.patient.id,
    })

    res.status(201).json(newReview)

    } catch (error) {
         res.status(500).json({ message: error.message });
    }
}


const getReviews = async (req,res) => {
    try {

        const reviews = await reviewModel.find({doctorId:req.params.doctorId})
        .populate("patientId","name")
        .sort({createdAt : -1})

        res.json(reviews)
        
    } catch (error) {
         res.status(500).json({ message: error.message });
    }
}

const getTopReviews = async(req,res) => {
    try {
        
        const reviews = await reviewModel
        .find()
        .populate("doctorId", "name department imgUrl")
        .populate("patientId", "name imgUrl")
        .sort({ rating: -1, createdAt: -1 })
        .limit(6)

        res.json(reviews)

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {addReviews,getReviews, getTopReviews}