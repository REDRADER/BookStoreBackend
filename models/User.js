import mongoose from "mongoose";

const userSchema=mongoose.Schema(
    {
        name:String,
        email:String,
        password:String,
        phone:String,
        role:String,
        cart:{
            type:Array,
            default:[],
        },
        books:[]
        
    },
    {
        timestamps:true,
    }
)

const User =mongoose.model("User",userSchema)

export default User;