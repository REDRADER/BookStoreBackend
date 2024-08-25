import mongoose from "mongoose";

const BookHistorySchema = mongoose.Schema(
    {
        name: String,
        bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        status: String,
        issueDate: Date,
        expectedReturnDate: Date,
        returnDate: Date,
        remark: String,
    },
    {
        timestamps: true,
    }
)

const BookHistory = mongoose.model("BookHistory", BookHistorySchema)

export default BookHistory;