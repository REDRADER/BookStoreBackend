import Book from "../models/Book.js";
import User from "../models/User.js";
import BookHistory from "../models/BookHistory.js";

export const getDashBoardData = async (req, res) => {

    try {

        const books = await Book.find();
        const bookHistory=await BookHistory.find({status:"issued"});

        const totalBooks = books.length;
        const copies = books.reduce((acc, book) => {
            return acc = parseInt(book.quantity) + acc;

        }, 0)
        const totalCopies=copies+bookHistory.length;
        const totalIssuedBooks=bookHistory.length;
        const users = await User.find({ role: { $ne: 'ADMIN' } });
        const totalUsers = users.length

        return res.status(200).json({

            totalBooks,
            totalCopies,
            totalUsers,
            totalIssuedBooks
        }
        );
    }
    catch (err) {
        return res.status(500).json({ error: err.message })
    }
}