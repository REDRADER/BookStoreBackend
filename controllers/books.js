import Book from "../models/Book.js";
import User from "../models/User.js";



export const getHomeBooks = async (req, res) => {

    try {


        const books = await Book.find();

        const booksByCategory = {};
        books.forEach(book => {
            if (!booksByCategory[book.category]) {
                booksByCategory[book.category] = [];
            }
            booksByCategory[book.category].push(book);
        });



        return res.status(200).json(
            booksByCategory,
        );


    }
    catch (err) {
        return res.status(404).json({ error: err.message })
    }
}
export const getBooks = async (req, res) => {

    try {

        // const page = parseInt(req.query.page) || 1;
        // const limit = parseInt(req.query.limit) || 10;

        // const allBooks = await Book.countDocuments();
        // const totalPages = Math.ceil(allBooks / limit);

        // const skip = (page - 1) * limit;


        // const books = await Book.find().skip(skip).limit(limit);

        // return res.status(200).json({
        //     currentPage: page,
        //     totalPages: totalPages,
        //     totalBooks: allBooks,
        //     Books: books,
        // });
        const books = await Book.find();
        return res.status(200).json(
            books,
        );
    }
    catch (err) {
        return res.status(404).json({ error: err.message })
    }
}
export const getBookById = async (req, res) => {


    try {

        const id = req.params.id;
        // console.log(id);
        const book = await Book.findById(id)
        return res.status(200).json(
            book,
        );
    }
    catch (err) {
        return res.status(404).json({ error: err.message })
    }

}
export const getRelatedBookById = async (req, res) => {


    try {

        const id = req.params.id;
        // console.log(id);
        const book = await Book.findById(id)
        const relatebooks = await Book.find({ category: book.category })
        return res.status(200).json(
            relatebooks,
        );
    }
    catch (err) {
        return res.status(404).json({ error: err.message })
    }

}
export const addBooks = async (req, res) => {
    try {
        const uniqueNames = req.files.map(file => file.filename);
        const {
            name,
            description,
            category,
            price,
            available,
            authorName,
            authorShortDescripton,
            rating,
            quantity

        } = req.body

        const newBook = new Book({
            name,
            description,
            photo: uniqueNames,
            category,
            price,
            available,
            rating,
            quantity,
            author: {
                name: authorName,
                shortDescripton: authorShortDescripton
            },
            issuedTo: []

        })

        const saveBook = await newBook.save()



        return res.status(201).json({
            msg: "Book Added",
            data: saveBook
        })

    } catch (err) {
        console.log(err);
        return res.status(409).json({ msg: err.message })
    }
}
export const updateBook = async (req, res) => {
    try {
        const uniqueNames = req.files.map(file => file.filename);
        const id = req.params.id;
        const {
            name,
            description,
            category,
            price,
            available,
            rating,
            authorName,
            authorShortDescripton,
            quantity,

        } = req.body

        const book = await Book.findById(id);

        book.name = name;
        book.description = description;
        book.category = category;
        book.price = price;
        book.available = available;
        book.rating = rating;
        book.quantity = quantity;

        book.author.name = authorName;
        book.author.shortDescripton = authorShortDescripton;


        if (uniqueNames.length > 0) {
            book.photo = uniqueNames;
        }

        const updateBook = await book.save()



        return res.status(201).json(updateBook)

    } catch (err) {
        console.log(err);
        return res.status(409).json({ msg: err.message })
    }
}

export const searchBook = async (req, res) => {
    try {
        const { q } = req.query;

        console.log(q)

        // Create a query to q by phone, name, or email
     

        if (!q) {
            const books = await Book.find();

            return res.status(200).json(books);
        }
        let query = {

            $or: [
                { category: { $regex: q, $options: 'i' } },
                { name: { $regex: q, $options: 'i' } },
                { description: { $regex: q, $options: 'i' } },
             
            ]

        };

        // Retrieve users based on the constructed query
        const books = await Book.find(query);

        if (books.length === 0) {
            return res.status(404).json({ error: "No Books Found", msg: "No Books Found" });
        }

        // Return the retrieved users
        return res.status(200).json(books);

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};



