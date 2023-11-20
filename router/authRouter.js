const express=require('express')
const jwt=require('jsonwebtoken')
const Signup=require('../models/singupModel');
const bcrypt=require('bcryptjs')
const {auth}=require('../middleware/auth')
const register=async(req,res)=>{

    // console.log(req);
    try{
       
     if(req.body.password!==req.body.cpassword){
        res.status(404).json({
            message:"password doesn't match"
        })
     }else{
        const user=await Signup.create(req.body);
        const payload={
            userId:user._id
        }
        const token=jwt.sign(payload,process.env.SECRETKEY)
        
        const options={
            expires:new Date(Date.now()+process.env.EXPIREC*24*60*60*1000),
        }
        res.status(201).cookie('token',token,options).json({
            message:"Successfully signup",
            token
        })
     }
    }catch(err){
        if (err.message) {
            res.status(400).json({ message: err.message });
        } else{

            res.status(500).json({ message: 'An error occurred during signup.' });
        }     
    }
}

const router=express.Router();
router.route('/register').post(register);




const loginFunction=async(req,res)=>{
    try{
      if(!(req.body.email && req.body.password)){
        res.status(404).json({
            message:"user email and password was incorrect",
            success:false
        })
        return ;
      }
    const user =await Signup.findOne({email:req.body.email});
    
    if(user && await bcrypt.compare(req.body.password,user.password)){
       
        const payload={
            userId:user._id
        }
       
        const token=jwt.sign(payload,process.env.SECRETKEY)
        
        const options={
            expires:new Date(Date.now()+process.env.EXPIREC*24*60*60*1000),
        }
        res.status(201).cookie('token',token,options).json({
            message:"login successfully",
             token,
            user
        })
      
    }else{
        res.status(404).json({
            message:"user email and password was incorrect",
            success:false
        })
    }
    
    }catch(err){
        console.log(err);
        res.status(500).json({
            message:"server err or email or password was incorrect",
            err
        })
    }
    }
    router.route('/login').post(loginFunction);



    const logout=async(req,res)=>{
        try{
            const options={
                expires:new Date(Date.now(0)),
                httpOnly:true,
                sameSite: 'none',
            secure:true
            }
            res.status(201).cookie('token',null,options).json({
                success:true,
                message:"Logout Successfully",
            })
        }catch(err){
                res.status(500).json({ message: err });
            
        }
    }
    router.route('/logout').get(auth,logout);
module.exports=router;