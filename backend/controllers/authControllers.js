const express = require('express')
const patientModel = require("../models/patientModel")
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const {validateSignuUpData} = require('../utils/validations')





exports.signup = async(req,res)=>{
    try {

       validateSignuUpData(req)

       const {name,email,password,imgUrl, phone, gender,  age, address,role} = req.body

       console.log("singup data",name,email,password);
       
       const existingUser = await patientModel.findOne({ email });
        if (existingUser) {
      return res.status(409).json({ error: "Email already registered." });
    }
       
      const hashPassword = await bcrypt.hash(password,10)

      const patient = new patientModel({
        name,
        email,
        password : hashPassword,
        imgUrl, 
        phone, 
        gender,  
        age, 
        address,
        role
      })


    
      const savedPatient = await patient.save()
   
    
       
      const token = jwt.sign({_id:savedPatient._id},process.env.JWT_SECRET,{
        expiresIn : "7d"
      })

      

      res.cookie("token",token)
      res.json({msg: "data added successfully!!", token: token, data:savedPatient})
      
        
    } catch (error) {
         return res.status(400).json({ message: error.message });
    }
}


exports.login = async(req,res) =>{
    try {

        const {email,password} = req.body

        const patient = await patientModel.findOne({email:email})

        if(! patient)
        {
            return res.status(400).send("Invalid credentials!")
        }

       
        const isPasswordValid = await bcrypt.compare(password,patient.password)
        if(! isPasswordValid)
        {
            return res.status(401).send("Invalid credentials!");
        }

         const token = await jwt.sign({_id:patient._id},process.env.JWT_SECRET,{
            expiresIn : "7d"
        })
       
        
        console.log("Login token:",token);
      
        

      res.cookie("token",token)
       res.status(200).send({token:token, data: patient});


    } catch (error) {
         res.status(500).send("ERROR :" + error.message)
    }
}

exports.logout = async(req,res) => {
    try {
        res.cookie("token",null,{
         expires:new Date(Date.now())
        })
       res.status(200).json({ message: "Logged out successfully" });  
    } catch (error) {
        res.status(500).send("ERROR :" + error.message)
    }
}