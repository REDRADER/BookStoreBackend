import express from "express";
import { verifyToken } from "../middleware/auth.js";
import {getBooks,getBookById} from '../controllers/books.js'
import {addToCart, removeFromCart} from '../controllers/user.js'

const router=express.Router()


router.post("/addToCart/:id",verifyToken,addToCart);
router.post("/removeFromCart/:id",verifyToken,removeFromCart);
// router.get("/:id",getBookById);

// router.post("/editBooks/:id",verifyToken,resetAppartment);

// router.get("/cancelAppartment/:id",getAppartments);




export default router;