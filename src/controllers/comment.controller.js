const userModel = require("../models/user.model");
const postModel = require("../models/post.model");
const commentModel = require("../models/comment.model");
const mongoose = require('mongoose');
const createError = require('http-errors');
const { getSuccessResponse } = require("../utils/response");

exports.getComment = async (req, res, next) => {
    try {
        const { userId, postId } = req.params;

        const user = await userModel.findById(userId);
        if (!user) throw createError(404, "User does not exists");

        const post = await postModel.findById(postId);
        if (!post) throw createError(404, "Post does not exists");

        const comment = await commentModel.find({ postId });
        return res.json(getSuccessResponse("Post fetched Succesfully", comment));
    } catch (error) {
        next(error);
    }
};

exports.addComment = async (req, res, next) => {
    try {
        const { userId, postId } = req.params;
        const payload = req.body;

        const user = await userModel.findById(userId);
        if (!user) throw createError(404, "User does not exists");

        const post = await postModel.findById(postId);
        if (!post) throw createError(404, "Post does not exists");

        const comment = await commentModel.create({ userId, postId, ...payload });
        return res.json(getSuccessResponse("Comment Added Succesfully", comment));
    } catch (error) {
        next(error);
    }
};


exports.getCommentById = async (req, res, next) => {
    try {
        const { userId, postId, commentId } = req.params;

        const user = await userModel.findById(userId);
        if (!user) throw createError(404, "User does not exists");

        const post = await postModel.findById(postId);
        if (!post) throw createError(404, "Post does not exists");

        const comment = await commentModel.findById(commentId);
        if (!comment) throw createError(404, "Comment does not exists");

        return res.json(getSuccessResponse("Comment fetched Succefsully", comment));
    } catch (error) {
        next(error);
    }
};


exports.updateComment = async (req, res, next) => {
    try {
        const { userId, postId, commentId } = req.params;

        const payload = req.body;
        const options = { new: true };

        const user = await userModel.findById(userId);
        if (!user) throw createError(404, "User does not exists");

        const post = await postModel.findById(postId);
        if (!post) throw createError(404, "Post does not exists");

        const comment = await commentModel.findById(commentId);
        if (!comment) throw createError(404, "Comment does not exists");

        const updatedComment = await commentModel.findOneAndUpdate(
            { _id: commentId, userId: userId },
            { $set: payload },
            { options }
        );
        if (!updatedComment) throw createError(404, "Not Authorized user");

        return res.json(getSuccessResponse("Comment Updated Succesfully", updatedComment));
    } catch (error) {
        next(error);
    }
};


exports.deleteComment = async (req, res, next) => {
    try {
        const { userId, postId, commentId } = req.params;

        const user = await userModel.findById(userId);
        if (!user) throw createError(404, "User does not exists");

        const post = await postModel.findById(postId);
        if (!post) throw createError(404, "Post does not exists");
        
        const comment = await commentModel.findById(commentId);
        if (!comment) throw createError(404, "Comment does not exists");

        const usersPost = await postModel.findOne({ _id: postId , userId : userId});
        const cmt = await commentModel.findOne({_id: commentId, userId: userId, postId: postId});
        
        if(!usersPost){
        }else{
            if(!cmt){
                throw createError(404, "Not Authorized user");
            }else{
                await commentModel.findByIdAndUpdate(userId,{isDelete : true});
            }
        }

        // if(usersPost.userId == userId && usersPost._id == postId || 
        // if(postModel.findOne({ _id: postId , userId : userId}) || 
        //     (commentModel.findOne({_id: commentId, userId: userId, postId: postId}))) 
        //     {
        //     await commentModel.findByIdAndDelete(commentId);
        // }else{
        //     throw createError(404, "Not Authorized user");
        // }
        // const commentToDelete = await commentModel.findOneAndDelete(
        //     {
        //         $or: [
        //             { _id: commentId, userId: userId, postId: postId },
        //             { usersPost, _id:commentId }
        //         ]
        //     } 
        // );
        return res.json(getSuccessResponse("Comment Deleted Succesfully"));
    } catch (error) {
        next(error)
    }
};
