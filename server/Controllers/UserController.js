
import UserModel from '../Models/userModel.js'

export const getUser = async(req,res )=> {
    const id = req.params.id

    try{
        const user = await UserModel.findById(id)

        if(user) {
            const {password, ...OtherDetails} = user._doc
            res.status(200).json(OtherDetails)
        } else res.status(404).json("No such as User exists")
    }catch(error) {
        res.status(404).json({message: error.message})
    }
}


export const updateUser = async(req,res) => {
    const id = req.params.id
    const {currentUserId, currentUserAdminStatus, password} = req.body


    if(id===currentUserId || currentUserAdminStatus) {
        try {
            const user = await UserModel.findByIdAndUpdate(id, req.body, {new : true})
            res.status(200).json(user)

        }catch(error) {
            res.status(500).json(error)
        }
    }
    else res.status(403).json("Access denied")

}


export const deleteUser = async(req,res) => {
    const id = req.params.id
    const {currentUserAdminStatus} = req.body
    if( currentUserAdminStatus) {
        try{
            await UserModel.findByIdAndDelete(id)
            res.status(200).json('User deleted successfully')
        } catch(error) {
            res.status(404).json(error)
        }
    } else {
        res.status(403).json('Access denied')
    }
}


export const followUser = async(req, res) => {
    const id = req.params.id
    const {currentUserId} = req.body
    if(id === currentUserId) {
        res.status(403).json("Cannot activate action")
    } else {
        try {
            const followUser = await UserModel.findById(id)
            const followingUser = await UserModel.findById(currentUserId)
            if(!followUser.followers.includes(currentUserId)) {
                await followUser.updateOne({$push: {followers: currentUserId}})
                await followingUser.updateOne({$push: {following: id}})
                res.status(200).json("Success")
            } else {
                res.status(405).json("Already following")
            }

        } catch(error) {
            res.status(404).json(error)
        }
    }
}

export const unFollowUser = async(req, res) => {
    const id = req.params.id
    const {currentUserId} = req.body
    if(id === currentUserId) {
        res.status(403).json("Cannot activate action")
    } else {
        try {
            const followUser = await UserModel.findById(id)
            const followingUser = await UserModel.findById(currentUserId)
            if(!followUser.followers.includes(currentUserId)) {
                res.status(405).json("You are not following thi user")
            } else {
                await followUser.updateOne({$pull: {followers: currentUserId}})
                await followingUser.updateOne({$pull: {following: id}})
                res.status(200).json("Unfollowing success")
            }

        } catch(error) {
            res.status(404).json(error)
        }
    }
}