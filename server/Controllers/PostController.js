import PostModel from '../Models/PostModel.js'
import mongoose from 'mongoose'
import UserModel from '../Models/userModel.js'


export const createPost = async (req, res) => {
    const newPost = new PostModel(req.body);
  
    try {
      await newPost.save();
      res.status(200).json(newPost);
    } catch (error) {
      res.status(500).json(error);
    }
  };


export const getPost = async(req,res) => {
    const id = req.params.id
    try {
        const post = await PostModel.findById(id)
        res.status(200).json(post)
    } catch( error ) { 
        res.status(404).json(error)
    }
}

export const updatePost = async(req,res) => {
    const postid = req.params.id
    const {userId} = req.body

    try {
        const post = await PostModel.findById(postid)
        if(post.userId === userId) {
            await post.updateOne({$set: req.body})
            res.status(200).json('Update Post Success')
        } else res.status(400).json("failed")

    } catch (error) {
        res.status(404).json(error)
    }    
}


export const deletePost = async(req,res) => {
    const postid = req.params.id
    const {userId} = req.body

    try {
        const post = await PostModel.findById(postid)
        if(post.userId === userId) {
            await post.deleteOne()
            res.status(200).json('Delete Success')
        } else res.status(400).json('Failed')
    }catch(error){
        res.status(404).json(error)
    }
}


export const likePost = async(req,res) => {
    const postId = req.params.id

    const {userId} = req.body

    try {
        const post = await PostModel.findById(postId)
        if(!post.likes.includes(userId)) {
            await post.updateOne({$push: {likes: userId}})
            res.status(200).json("Like Success")
        } else res.status(400).json("Already Liked")
    }catch(error) {
        res.status(404).json(error)
    }
}

export const getTimeLinePosts = async(req,res) => {
    const userId = req.params.userId

    try {
        const currentUserPosts = await PostModel.find({userId: userId})
        const followingPosts = await UserModel.aggregate([
            {
                $match: {
                    _id:new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $lookup: {
                    from: "posts",
                    localField: "following",
                    foreignField: "userId",
                    as: "followingPosts"
                }
            },
            {
                $project: {
                    followingPosts: 1,
                    _id: 0
                }
            }
        ])

        res.status(200).json(currentUserPosts.concat(...followingPosts[0].followingPosts).sort((a, b)=>{
            return b.createdAt - a.createdAt
        }))
    }catch(error) {
        res.status(404).json(error)
    }

}