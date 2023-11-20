const express=require('express');
const User=require('../models/userModel');
const router=express.Router();
const createUser=async(req,res)=>{
    try{
       
       if(req.body.first_name && req.body.id && req.body.last_name && req.body.email && req.body.gender && req.body.domain ){
        const user=await User.create(req.body);
        res.status(201).json({
            "success":true,
            "message":"user Created  SuccessFully",
            user
        })
    }else{
        res.status(404).json({
               "success":false,
               "message":"Fill All required Field",
            })
        }
    }catch(err){
        res.status(500).json({
            "success":false,
            "message":"server err , try after sometime",
            err
        })
        
    }
}

router.route('/create/user').post(createUser);


// get all user threw pagination 
const getAllUser=async(req,res)=>{
    try{
        const { domain, gender, availability, search, page = 1, pageSize = 20 } = req.query;
     

         // Build the filter object based on provided criteria
    const filter = {};
    if (domain) filter.domain = domain;
    if (gender) filter.gender = gender;
    if (availability==="true" ||availability==="false") filter.available = availability === 'true';
// Build the search query for names
const nameSearchQuery = search ? { $or: [{ first_name: new RegExp(search, 'i') }, { last_name: new RegExp(search, 'i') }] } : {};
// Calculate total count for pagination
const totalCount = await User.countDocuments({ ...filter, ...nameSearchQuery });

// Calculate total pages
const totalPages = Math.ceil(totalCount / pageSize);

// Fetch users based on filter, search, and pagination
const users = await User.find({ ...filter, ...nameSearchQuery })
  .skip((page - 1) * pageSize)
  .limit(Number(pageSize))
  .exec();
        res.status(200).json({
            users,
            totalCount,
            totalPages,
            currentPage: Number(page),
          });
    }catch(err){
        console.log(err);
        res.status(500).json({
            "success":false,
            "message":"server err , try after sometime",
            err
        })
    }
    
}

router.route('/get/user').get(getAllUser);


/// search user by id 
const getUserByid=async(req,res)=>{
    try{
        const userId = req.params.id;

        const user = await User.findOne({ id: userId }).exec();
    
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }   
        res.status(200).json({
            user            
        })
    }catch(err){
        res.status(500).json({
            "success":false,
            "message":"server err , try after sometime",
            err
        })
    }
}

router.route('/get/user/:id').get(getUserByid);



/// update user by id 
const UpdateUserByid=async(req,res)=>{
    try{
        const userId = req.params.id;
      
        const updatedUser = await User.findOneAndUpdate({ id: userId }, req.body, { new: true });
        if(updatedUser){

            res.status(200).json({
                updatedUser,
                "message":"user Updated SuccessFully",            
            })
        }else{
            return res.status(404).json({ error: 'User not found' });
        }
    }catch(err){
        console.log(err);
        res.status(500).json({
            "success":false,
            "message":"server err , try after sometime",
            err
        })
    }
}

router.route('/update/user/:id').put(UpdateUserByid);



// delete user by id 
const deleteUserByid=async(req,res)=>{
    try{
        const userId = req.params.id;
      
        const deletedUser = await User.findOneAndDelete({ id: userId }).exec();
        if(deletedUser){

            res.status(200).json({
                "message":"user Deleted SuccessFully",
                deletedUser           
            })
        }else{
            return res.status(404).json({ error: 'User not found' });
        }
    }catch(err){
        res.status(500).json({
            "success":false,
            "message":"server err , try after sometime",
            err
        })
    }
}

router.route('/delete/user/:id').delete(deleteUserByid);

module.exports=router;