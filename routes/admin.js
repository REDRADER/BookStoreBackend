import express from "express";

import {getAllBookHistory, getBookHistoryByBookId, getBookHistoryByUserId, issueBook, returnBook} from "../controllers/IssueBook.js"

import {addUser, editUser, getUserById, getUserByPhoneNameOrEmail, getUsers} from "../controllers/user.js"
import { getDashBoardData } from "../controllers/dashboard.js";

const router=express.Router()



router.post("/issueBook",issueBook);
router.post("/returnBook",returnBook);
router.get("/history",getAllBookHistory);
router.get("/history/:bookId",getBookHistoryByBookId);
router.get("/getusers",getUserByPhoneNameOrEmail);
router.get("/users",getUsers);
router.get("/dashboard",getDashBoardData);
router.get("/user-issued-books/:userId",getBookHistoryByUserId);
router.get("/user/:id",getUserById);
router.post("/addUser",addUser);
router.post("/edit-user/:id",editUser);


// router.get("/cancelAppartment/:id",getAppartments);




export default router;