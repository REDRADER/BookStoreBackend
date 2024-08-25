import Book from "../models/Book.js";
import User from "../models/User.js";

// add to cart

export const addToCart = async (req, res) => {

    try {
        const id = req.params.id;
        const book = await Book.findById(id);
        if (!book) {
            return res.status(404).json({ error: `book not found with the book Id ${id}` });
        }

        const user = await User.findById(req.user.id);

        const alreadyPresent = user.cart.find(item => item.id === book.id);

        let tempCart = []
        if (user.cart.length === 0) {
            tempCart.push({
                id: book.id,
                quantity: 1
            })

        }
        else if (!alreadyPresent) {
            tempCart = [...user.cart, {
                id: book.id,
                quantity: 1
            }]
        }
        else {
            console.log(user.cart);
            tempCart = user.cart.map((item) => {
                if (item.id === book.id) {
                    item.quantity += 1
                }
                return item;
            })
            console.log(tempCart);
        }
        user.cart = tempCart;

  





        const updateUserCart = await user.save();



        return res.status(201).json({
            msg: "Book Added to Cart",
            data: {
                book: {
                    name: book.name,
                    id: book.id,
                },
                cart: updateUserCart.cart,
            }
        });

    } catch (err) {
        console.log(err);
        return res.status(404).json({ error: err.message });
    }
}

// remove from cart

export const removeFromCart = async (req, res) => {

    try {
        const id = req.params.id;
        const book = await Book.findById(id);
        if (!book) {
            return res.status(404).json({ error: `book not found with the book Id ${id}` });
        }
        const user = await User.findById(req.user.id);

        let tempCart = []
        if (user.cart.length === 0) {
            tempCart = [];

        }
        else {
            tempCart = user.cart.filter((item) => item.id !== book.id)
        }
        user.cart = tempCart;


        console.log(user)
        const updateUserCart = await user.save();

        console.log(updateUserCart)



        return res.status(201).json({
            msg: "Book Removed From Cart",
            data: {
                book: {
                    name: book.name,
                    id: book.id,
                },
                cart: updateUserCart.cart,
            }
        });

    } catch (err) {
        console.log(err);
        return res.status(404).json({ error: err.message });
    }
}

// decrease Quantity

export const decreaseQuantity = async (req, res) => {

    try {
        const id = req.params.id;
        const book = await Book.findById(id);
        if (!book) {
            return res.status(404).json({ error: `book not found with the book Id ${id}` });
        }
        const user = await User.findById(req.user.id);

        let tempCart = []
        if (user.cart.length === 0) {
            tempCart.push({
                id: book.id,
                quantity: 2
            })

        }
        else {
            tempCart = user.cart.map((item) => {
                if (item.id === book.id) {
                    item.quantity += 1
                }
                return item;
            })
        }
        user.cart = tempCart;




        const updateUserCart = await user.save();



        return res.status(201).json({
            msg: "Book Added to Cart",
            data: {
                book: {
                    name: book.name,
                    id: book.id,
                },
                cart: updateUserCart.cart,
            }
        });

    } catch (err) {
        console.log(err);
        return res.status(404).json({ error: err.message });
    }
}

export const getUserByPhoneNameOrEmail = async (req, res) => {
    try {
        const { search } = req.query;

       

        // Create a query to search by phone, name, or email
        let query = { role: { $ne: 'ADMIN' } };

        if (search) {
            // Add the search criteria to the query
            query = {
                $and: [
                    { role: { $ne: 'ADMIN' } },
                    {
                        $or: [
                            { phone: { $regex: input, $options: 'i' } },
                            { name: { $regex: input, $options: 'i' } },
                            { email: { $regex: input, $options: 'i' } }
                        ]
                    }
                ]
            };
        }

        // Retrieve users based on the constructed query
        const users = await User.find(query);

        if (users.length === 0) {
            return res.status(404).json({ error: "No Users Found", msg: "No Users Found" });
        }

        // Return the retrieved users
        return res.status(200).json(users);

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// place order

// get all orders

// view Specific Orders

