const express =require('express');
const app=express();
const cors=require('cors')
const cookieParser=require('cookie-parser');
const bodyParser=require('body-parser')
const dotenv=require('dotenv')
dotenv.config({path:'./config/config.env'})
const dbconnection=require('./server');
dbconnection();
const AuthRouter=require('./router/authRouter')
const UserRouter=require('./router/userRouter')
const TeamRouter=require('./router/TeamRouter')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin:process.env.WEBLINK,
    credentials: true,
    methods:["GET","POST","DELETE","PUT"]
}));
app.use('/api/v1',AuthRouter)
app.use('/api/v1',UserRouter)
app.use('/api/v1',TeamRouter);

app.listen(process.env.PORT,()=>{
    console.log("working on localhost",process.env.PORT);
})