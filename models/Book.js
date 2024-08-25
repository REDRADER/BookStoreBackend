import mongoose from "mongoose";

const bookSchema=mongoose.Schema(
    {
        name:String,
        description:String,
        rating:Number,
        photo:{
            type:Array,
            default:[]
        },
        category:String,
       
        price:String,
        available:Boolean,
        author:{
            name:String,
            shortDescripton:String
        },
        quantity:Number,
        issuedTo:[],



    },
    {
        timestamps:true,
    }
)

const Book =mongoose.model("Book",bookSchema)

export default Book;