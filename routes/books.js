import express from "express";
import { verifyToken } from "../middleware/auth.js";
import {getBooks,getBookById, getHomeBooks, getRelatedBookById, searchBook} from '../controllers/books.js'

const router=express.Router()


router.get("/",getBooks);
router.get("/search",searchBook);
router.get("/home",getHomeBooks);
router.get("/:id",getBookById);
router.get("/related/:id",getRelatedBookById);



// router.get("/cancelAppartment/:id",getAppartments);




export default router;