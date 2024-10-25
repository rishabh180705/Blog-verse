import mongoose from "mongoose";

const urlSchema= new mongoose.Schema({
    username:{
        type:String,
        require:true,
       
     },
     email:{
        type:String,
        require:true,
        unique:true,
     },
     password:{
        type:String,
        require:true,
     },
     profileImgURL:{
      type:String,
      default:"/images/default.jpg"
     },
     role:{
        type:String,
         enum:['admin','user'],
         default:'user'
     },
     myBlogs:{
        type: mongoose.Schema.Types.ObjectId,  // Referencing the User model
        ref: 'Blog',
     }
   

},{timestamps:true});

export const USER=mongoose.model("USER",urlSchema);