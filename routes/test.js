import express from "express";
import { verifyToken } from "../middleware/auth.js";
import {testFunction} from '../controllers/test.js'

const router=express.Router()


router.get("/",testFunction);


// router.post("/editBooks/:id",verifyToken,resetAppartment);

// router.get("/cancelAppartment/:id",getAppartments);




export default router;