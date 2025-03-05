 import express from "express";
 import auth from "../middleware/auth.js";
 import { getPostsBySearch,getPosts ,getPost,createPost,getUserPosts,updatePost,deletePost,likePost,commentPost} from "../controllers/posts.js";
 const router=express.Router();
 
 router.get('/search',getPostsBySearch);
 router.get('/',getPosts);
 router.get('/:id',getPost);
 router.post('/',auth,createPost);
 router.patch('/:id',auth,updatePost);
 router.get('/user/:id', getUserPosts);
 router.delete('/:id',auth,deletePost);
 router.patch('/:id/likePost',auth,likePost);
 router.post('/:id/commentPost',auth, commentPost);
 export default router;