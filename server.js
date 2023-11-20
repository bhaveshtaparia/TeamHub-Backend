const mongoose=require('mongoose');
const dbconnection=async()=>{
   try{
    const response = await mongoose.connect(
        process.env.MONGO_URI,
    );
    if (response) {
        console.log("MongoDB connected...");
    }
   }catch(err){
    console.log(err);
    process.exit(1);
   }
}
module.exports=dbconnection;