import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// register user

export const register=async(req,res)=>{
    try{
        const { name, email, password, phone } = req.body;

      
        const salt=await bcrypt.genSalt();
       
        const passwordHash=await bcrypt.hash(password,salt);

        const newUser=new User({
            name,
            phone,
            email,
            password:passwordHash,
           
            role:"USER"
        });

        const savedUser=await newUser.save();
        delete savedUser.password;
        res.status(201).json(savedUser);
    }catch(err)
    {
        res.status(500).json({error:err.message});
    }
};


// logging idn

export const login=async(req,res)=>{

    try{

        const {email,password}=req.body;
        const user=await User.findOne({email:email});
        if(!user) return res.status(400).json({msg:"user not found"});

        const isMatch= await bcrypt.compare(password,user.password);
        if(!isMatch) return res.status(400).json({msg:"invalid credentials"});

        const payload = {
            id:user._id,
            role: user.role,
           
          };
        const token =jwt.sign(payload,process.env.JWT_SECRET,{ expiresIn: '6h' });
        delete user.password;

        res.status(200).json({token,user});
        



    }catch(err)
    {
        res.status(500).json({error:err.message});
    }
} 
