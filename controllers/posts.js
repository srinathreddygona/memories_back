import mongoose from "mongoose";
import PostMessage from "../models/postMessage.js";
// import express from "express";
// const router=express.Router();

 
 export const getPosts=async(req,res)=>{
  const {page}=req.query;

    try{
        const LIMIT=6;
        const startIndex=(Number(page)-1)*LIMIT;
        const total=await PostMessage.countDocuments({});
        const posts= await PostMessage.find().sort( { _id:-1}).limit(LIMIT).skip(startIndex);
       
        
        res.status(200).json({data:posts,currentPage:Number(page),numberOfPages:Math.ceil(total/LIMIT)});
    }
    catch(error){
        res.status(404).json({message:error.message});


    }
 }

 export const getPostsBySearch = async (req, res) => {
  const { searchQuery, tags, userId } = req.query;

  try {
    console.log("🔍 Incoming Search Query:", searchQuery);
    console.log("🔍 Incoming Tags:", tags);
    console.log("🔍 Incoming userId:", userId);

    let filter = {}; // Start with an empty filter

    // Validate searchQuery: Ignore "none" or empty values
    let searchTerms = searchQuery && searchQuery !== "none" ? searchQuery.trim() : null;

    if (searchTerms) {
      const titleRegex = new RegExp(searchTerms, "i"); // Case-insensitive search
      filter.$or = [{ title: titleRegex }];
    }

    // Validate and format tags correctly
    if (tags && tags !== "none") {
      const tagArray = tags
        .split(",")
        .filter((tag) => tag.trim() !== "")
        .map((tag) => new RegExp(tag.trim().replace(/^#/, "").trim(), "i"));

      if (tagArray.length > 0) {
        if (!filter.$or) filter.$or = [];
        filter.$or.push({ tags: { $in: tagArray } });
      }
    }

    // If userId is present, filter by creator
    if (userId) {
      filter.creator = userId;
    }

    console.log("🛠️ Fixed Query Filter:", JSON.stringify(filter, null, 2));

    const posts = await PostMessage.find(filter);
    console.log("📌 Found Posts:", posts.length);

    res.json({ data: posts });
  } catch (error) {
    console.error("❌ Error Fetching Posts:", error.message);
    res.status(404).json({ message: error.message });
  }
};










 export const getPost = async (req, res) => { 
  const { id } = req.params;

  try {
      const post = await PostMessage.findById(id);
      
      res.status(200).json(post);
  } catch (error) {
      res.status(404).json({ message: error.message });
  }
}



export const getUserPosts = async (req, res) => {
  try {
      const { id } = req.params; // Extract user ID from request params
      const { page = 1 } = req.query; // Default page = 1

      console.log("🟡 Received user ID:", id, "Type:", typeof id);

      // Validate user ID (since it's stored as a string, no need for `ObjectId.isValid`)
      if (!id) {
          return res.status(400).json({ message: "User ID is required" });
      }

      const LIMIT = 6; // Number of posts per page
      const startIndex = (Number(page) - 1) * LIMIT;

      console.log("🔵 Fetching posts for user ID:", id);

      // Count total user posts
      const totalPosts = await PostMessage.countDocuments({ creator: id });
      console.log("🔍 Total Posts for User:", totalPosts);

      if (totalPosts === 0) {
          console.log("⚠️ No posts found for user:", id);
          return res.status(200).json({ data: [], currentPage: 1, numberOfPages: 1 });
      }

      // Fetch only posts created by this user
      const posts = await PostMessage.find({ creator: id })
          .sort({ createdAt: -1 }) // Sort newest first
          .limit(LIMIT)
          .skip(startIndex);

      console.log("🟢 Found", posts.length, "posts for user:", id);

      res.status(200).json({
          data: posts,
          currentPage: Number(page),
          numberOfPages: Math.ceil(totalPosts / LIMIT),
      });

  } catch (error) {
      console.error("❌ Error fetching user posts:", error);
      res.status(500).json({ message: "Something went wrong" });
  }
};








 export const createPost=async(req,res)=>{
    const post=req.body;
    const newPostMessage=new PostMessage({...post,creator:req.userId,createdAt:new Date().toISOString()});
   try {
     await newPostMessage.save();
    res.status(201).json(newPostMessage);
   } catch (error) {
    res.status(409).json({message:error.message});
   }
 }
 
export const updatePost=async(req,res)=>{
  const {id:_id} =req.params;
  const post=req.body;
  if(!mongoose.Types.ObjectId.isValid(_id))return res.status(404).send('No Posts with that ID');
  
  const updatedPost=await PostMessage.findByIdAndUpdate(_id,{...post,_id},{new: true});
  res.json(updatedPost);
}

export const deletePost =async(req,res)=>{
  const {id}=req.params;
  if(!mongoose.Types.ObjectId.isValid(id))return res.status(404).send('No Posts with that ID');

  await PostMessage.findByIdAndDelete(id);

  //console.log("delete!");

  res.json({message:'Post deleted successfully'});
} 

export const likePost =async(req,res)=>{
  const {id}=req.params;
  if(!req.userId)return res.json({message:'Unauthenticated'});

  if(!mongoose.Types.ObjectId.isValid(id))return res.status(404).send(`No post with that id`);
  const post=await PostMessage.findById(id);
  const index=post.likes.findIndex((id)=>id===String(req.userId));

  if(index===-1){
      //like the post
      post.likes.push(req.userId);
  }
  else{
    post.likes=post.likes.filter((id)=>id!==String(req.userId));
  }
  const updatedPost=await PostMessage.findByIdAndUpdate(id,post,{new:true});
  res.json(updatedPost);
}
export const commentPost = async (req, res) => {
  const { id } = req.params;
  const { value } = req.body;

  const post = await PostMessage.findById(id);

  post.comments.push(value);

  const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });

  res.json(updatedPost);
};
//export default router;