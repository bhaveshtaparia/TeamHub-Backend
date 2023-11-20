const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
    id:{
        type:Number,
        unique:true,
        required:true
    },
    first_name:{
        type:String,
        required:true
    },
    last_name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    gender:{
        type:String,
        required:true
    },
    avatar:{
        type:String
    },
    domain:{
        type:String,
        required:true
    },
    available:{
        type:Boolean,
        default:false
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})
module.exports=new mongoose.model('user',userSchema);