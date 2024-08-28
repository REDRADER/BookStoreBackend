import Book from "../models/Book.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
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
                            { phone: { $regex: search, $options: 'i' } },
                            { name: { $regex: search, $options: 'i' } },
                            { email: { $regex: search, $options: 'i' } }
                        ]
                    }
                ]
            };
        }

        // Retrieve users based on the constructed query
        const users = await User.find(query);

        const resUsers = users.map((user) => {
            return {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                books: user.books,
            }
        })
        if (users.length === 0) {
            return res.status(404).json({ error: "No Users Found", msg: "No Users Found" });
        }

        // Return the retrieved users
        return res.status(200).json(resUsers);

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};
export const getUsers = async (req, res) => {
    try {

        let query = { role: { $ne: 'ADMIN' } };

        // Retrieve users based on the constructed query
        const users = await User.find(query);

        const resUsers = users.map((user) => {
            return {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                books: user.books,
            }
        })
        if (users.length === 0) {
            return res.status(404).json({ error: "No Users Found", msg: "No Users Found" });
        }

        // Return the retrieved users
        return res.status(200).json(resUsers);

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};
export const getUserById = async (req, res) => {
    try {

        const {id}=req.params;
        
        // Retrieve users based on the constructed query
        const user = await User.findById(id);

        if(!user)
        {
            return res.status(404).json({ error: "No User Found with the id", msg: "No User Found with the id" });
        }
        const resUsers =  {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                books: user.books,
            }
        
      
        // Return the retrieved users
        return res.status(200).json(resUsers);
    
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};


export const addUser = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;


        const salt = await bcrypt.genSalt();

        let passwordHash = "";
        if (password) {
            passwordHash = await bcrypt.hash(password, salt);
        }
        else {
            passwordHash = await bcrypt.hash("user@123", salt);
        }

        const newUser = new User({
            name,
            phone,
            email,
            password: passwordHash,

            role: "USER"
        });

        const savedUser = await newUser.save();
        delete savedUser.password;

        res.status(201).json(savedUser);
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message });
    }
};

export const editUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password, phone } = req.body;

        const user = await User.findById(id);

        let passwordHash = ""
        if (password) {

            const salt = await bcrypt.genSalt();

            passwordHash = await bcrypt.hash(password, salt);
            user.password = passwordHash;
        }




        user.name = name;
        user.email = email;
        user.phone = phone;





        const savedUser = await user.save();
        delete savedUser.password;
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


