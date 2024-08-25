import Book from "../models/Book.js";
import User from "../models/User.js";
import BookHistory from "../models/BookHistory.js";

// Function to issue a book
export const issueBook = async (req, res) => {
    try {
        const { bookId, userId, issueDate, expectedReturnDate, status, remark } = req.body;

        // Find the book by ID
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ error: "Book Not Found", msg: "Book Not Found" });
        }

        // Check if the book is already issued to the user
        if (book.issuedTo.includes(userId)) {
            return res.status(400).json({ error: "Book Already Issued", msg: "Book Already Issued" });
        }

        // Check if there are enough books available
        if (book.quantity < 1) {
            return res.status(400).json({ error: "No Available Books to Issue", msg: "No Available Books to Issue" });
        }

        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User Not Found", msg: "User Not Found" });
        }

        // Create a new book issue history
        const newIssue = new BookHistory({
            name: book.name,
            bookId,
            userId,
            status,
            issueDate,
            expectedReturnDate,
            remark,
        });

        await newIssue.save();

        // Update the book's quantity and issuedTo list
        book.quantity -= 1;
        book.issuedTo.push(user._id);
        await book.save();

        // Update the user's books list
        user.books.push(book._id);
        await user.save();

        // Return success response
        return res.status(200).json({
            msg: "Book Issued Successfully",
            bookId,
            bookName: book.name,
            userId
        });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// Function to return a book
export const returnBook = async (req, res) => {
    try {
        const { bookId, userId, returnDate, remark } = req.body;

        // Find the book by ID
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ error: "Book Not Found", msg: "Book Not Found" });
        }

        // Check if the book was issued to the user
        if (!book.issuedTo.includes(userId)) {
            return res.status(400).json({ error: "Book Not Issued to This User", msg: "Book Not Issued to This User" });
        }

        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User Not Found", msg: "User Not Found" });
        }

        // Find the active book history record
        const bookHistory = await BookHistory.findOne({ bookId, userId, status: 'issued' });
        if (!bookHistory) {
            return res.status(400).json({ error: "No Active Book Issue Record Found", msg: "No Active Book Issue Record Found" });
        }

        // Update the book history record
        bookHistory.status = 'returned';
        bookHistory.returnDate = returnDate;
        bookHistory.remark = remark || bookHistory.remark;
        await bookHistory.save();

        // Update the book's quantity and issuedTo list
        book.quantity += 1;
        book.issuedTo = book.issuedTo.filter(id => id.toString() !== userId.toString());
        await book.save();

        // Update the user's books list
        user.books = user.books.filter(id => id.toString() !== bookId.toString());
        await user.save();

        // Return success response
        return res.status(200).json({
            msg: "Book Returned Successfully",
            bookId,
            bookName: book.name,
            userId,
            returnDate,
        });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// Function to get all book history
export const getAllBookHistory = async (req, res) => {
    try {
        // Fetch all book history records and populate book and user details
        const bookHistories = await BookHistory.find().populate('bookId').populate('userId');

        // Format the data to include book and user details
        const detailedHistories = bookHistories.map((history) => ({
            historyId: history._id,
            bookDetails: {
                id: history.bookId._id,
                name: history.bookId.name,
                author: history.bookId.author,
                quantity: history.bookId.quantity,
            },
            userDetails: {
                id: history.userId._id,
                name: history.userId.name,
                email: history.userId.email,
            },
            status: history.status,
            issueDate: history.issueDate,
            expectedReturnDate: history.expectedReturnDate,
            returnDate: history.returnDate,
            remark: history.remark,
            createdAt: history.createdAt,
            updatedAt: history.updatedAt,
        }));

        // Return the detailed history data
        return res.status(200).json(detailedHistories);

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// Function to get book history by book ID
export const getBookHistoryByBookId = async (req, res) => {
    try {
        const { bookId } = req.params;

        // Find all history records for the given book ID
        const bookHistories = await BookHistory.find({ bookId:bookId }).populate('userId');
        console.log(bookHistories)

        // Check if there are any history records for the provided book ID
        if (bookHistories.length === 0) {
            return res.status(404).json({ error: "No History Found for this Book", msg: "No History Found for this Book" });
        }

        // Fetch the book details
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ error: "Book Not Found", msg: "Book Not Found" });
        }

        // Format the data to include book and user details
        const detailedHistories = bookHistories.map((history) => ({
            historyId: history._id,
            bookDetails: {
                id: book._id,
                name: book.name,
                author: book.author,
                quantity: book.quantity,
            },
            userDetails: {
                id: history.userId._id,
                name: history.userId.name,
                email: history.userId.email,
            },
            status: history.status,
            issueDate: history.issueDate,
            expectedReturnDate: history.expectedReturnDate,
            returnDate: history.returnDate,
            remark: history.remark,
            createdAt: history.createdAt,
            updatedAt: history.updatedAt,
        }));

        // Return the detailed history data
        return res.status(200).json(detailedHistories);

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};
