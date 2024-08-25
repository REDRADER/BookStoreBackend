import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import helmet from "helmet";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import path from "path";
import {verifyAdminToken,verifyToken} from './middleware/auth.js'
import authRoutes from "./routes/auth.js"
import adminRoutes from "./routes/admin.js"
import booksRoutes from "./routes/books.js"

import usersRoutes from "./routes/users.js"


import { addBooks, updateBook } from "./controllers/books.js";
import { fileURLToPath } from "url"


const __filename=fileURLToPath(import.meta.url);
const __dirname=path.dirname(__filename);


dotenv.config()
const app=express();

app.use(express.json());
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({policy:"cross-origin"}));
app.use(bodyParser.json({limit:"30mb",extended:true}));
app.use(bodyParser.urlencoded({limit:"30mb",extended:true}));

app.use(cors());

app.use("/assets",express.static(path.join(__dirname,"public/assets")))


const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"public/assets")
    },
    filename:function(req,file,cb)
    {
        // console.log(file)
        const ext = file.originalname.split(".")[1];
        const filename = file.originalname.split(".")[0];

        cb(null,`${filename}-${Date.now()}.${ext}`);
    }
})

const upload = multer({storage});


// file upload routes
app.post("/admin/addBooks",verifyAdminToken,upload.array("pictures"),addBooks);
app.post("/admin/updateBook/:id",verifyAdminToken,upload.array("pictures"),updateBook);



// routes 
app.use("/admin",verifyAdminToken,adminRoutes);
app.use("/auth",authRoutes);
app.use("/books",booksRoutes)
app.use("/user",usersRoutes)









const PORT=3002

mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(()=>{
    app.listen(PORT,()=>{
        console.log("server started at "+PORT);
    })
}).catch((error)=>{
    console.log(error+"did not connect to mongodb")
})


