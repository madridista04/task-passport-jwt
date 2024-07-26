const userModel = require("../models/user.model");
const postModel = require("../models/post.model");
const commentModel = require("../models/comment.model");
const mongoose = require('mongoose');
const createError = require('http-errors');
const { getSuccessResponse } = require("../utils/response");

exports.getPost = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await userModel.findById(userId);
    if (!user) throw createError(404, "User does not exists");

    const posts = await postModel.find({ userId });
    return res.json(getSuccessResponse("Post fetched Succesfully", posts));
  } catch (error) {
    next(error);
  }
};

exports.addPost = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const payload = req.body;

    const user = await userModel.findById(userId);
    if (!user) throw createError(404, "User does not exists");

    const newPost = await postModel.create({ userId, ...payload });
    return res.json(getSuccessResponse("Posts Added Succesfully", newPost));
  } catch (error) {
    next(error)
  }
};

exports.getPostWithId = async (req, res, next) => {
  try {
    const { userId, postId } = req.params;

    const user = await userModel.findById(userId);
    if (!user) throw createError(404, "User does not exists");

    const post = await postModel.findById(postId);
    if (!post) throw createError(404, "Post does not exists");

    const getPost = await postModel.findById(postId);
    return res.json(getSuccessResponse("Post fetched Succesfully", getPost));
  } catch (error) {
    next(error);
  }
};

exports.updatePost = async (req, res, next) => {
  try {
    const { userId, postId } = req.params;
    const payload = req.body;
    const options = { new: true };

    const user = await userModel.findById(userId);
    if (!user) throw createError(404, "User does not exists");

    const post = await postModel.findById(postId);
    if (!post) throw createError(404, "Post does not exists");

    const updatedPost = await postModel.findOneAndUpdate(
      { _id: postId, userId: userId },
      { $set: payload },
      { options }
    );
    if (!updatedPost) throw createError(404, "Not Authorized user");
    return res.json(getSuccessResponse("Post Updated Succesfully", updatedPost));

  } catch (error) {
    next(error);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const { userId, postId } = req.params;

    const user = await userModel.findById(userId);
    if (!user) throw createError(404, "User does not exists");

    const post = await postModel.findById(postId);
    if (!post) throw createError(404, "Post does not exists");

    const postToDelete = await Promise.all([
      postModel.findOneAndUpdate({ _id: postId, userId: userId }, { isDelete: true }),
      commentModel.updateMany({ postId }, { isDelete: true })
    ]);

    if (!postToDelete) throw createError(404, "Not Authorized user");
    return res.json(getSuccessResponse("Post Deleted Succesfully"));
  } catch (error) {
    next(error);
  }
};

