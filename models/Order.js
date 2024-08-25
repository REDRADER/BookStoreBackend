import mongoose from "mongoose";

const OrderSchema=mongoose.Schema(
    {
        customerId:String,
        
        bookId:String,
       
        address:String,
        status:String,
        returnDate:Date,
   
    },
    {
        timestamps:true,
    }
)

const User =mongoose.model("Orders",OrderSchema)

export default User;