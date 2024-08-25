import express from "express";

import {getAllBookHistory, getBookHistoryByBookId, issueBook, returnBook} from "../controllers/IssueBook.js"

import {getUserByPhoneNameOrEmail} from "../controllers/user.js"

const router=express.Router()



router.post("/issueBook",issueBook);
router.post("/returnBook",returnBook);
router.get("/history",getAllBookHistory);
router.get("/history/:bookId",getBookHistoryByBookId);
router.get("/getusers",getUserByPhoneNameOrEmail);


// router.get("/cancelAppartment/:id",getAppartments);




export default router;