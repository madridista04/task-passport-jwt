const userModel = require("../models/user.model");
const postModel = require("../models/post.model");
const commentModel = require("../models/comment.model");
const createError = require('http-errors');
const { getSuccessResponse, getFailuerResponse } = require("../utils/response");
const { createAccessToken, createRefreshToken } = require("../utils/create-token");

exports.getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const users = await userModel.find({ isDelete: false }, { isDelete: 0, __v: 0 }).lean().limit(limit * 1).skip((page - 1) * limit);
    if (!users.length && page > 1) throw createError(404, 'error page not found');

    return res.json(getSuccessResponse("All Users fetched Succesfully", users));
  } catch (error) {
    next(error);
  }
};

exports.loginUser = async (req, res, next) => {
  return res.set().json(getSuccessResponse("Login Succesfully", req.user));
}

exports.getTokenFromRefreshToken = async (req, res, next) => {
  const userId = req.user._id;

  const accessToken = createAccessToken(userId.toString());
  const refreshToken = createRefreshToken(userId.toString());

  res.json(getSuccessResponse({ Tokens: { ACCESS_TOKEN: accessToken, REFRESH_TOKEN: refreshToken } }));
}

exports.addUser = async (req, res, next) => {
  try {
    const newUser = await userModel.create(req.body);
    return res.json(getSuccessResponse("User Created Succesfully", newUser));
  } catch (error) {
    next(error);
  }

};

exports.getUserWithId = async (req, res, next) => {
  try {

    const { userId } = req.params;

    const user = await userModel.findById(userId);
    if (!user || user.isDelete === true) throw createError(404, "User does not exists");

    if (user.isDelete !== true) {
      return res.json(getSuccessResponse("User fetched Succesfully", user));
    }
    return res.json(getFailuerResponse(404, "User Not Found"));
  } catch (error) {
    next(error);
  }

};

exports.updateUser = async (req, res, next) => {
  try {

    const { userId } = req.user;
    const payload = req.body;
    const options = { new: true };

    if (userId === req.params.userId) {
      const result = await userModel.findByIdAndUpdate(userId, payload, options);
      return res.json(getSuccessResponse("User Updated Succesfully", result));
    } else {
      throw createError.Unauthorized();      
    }
  } catch (error) {
    next(error);
  }

};

exports.deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.user;

     if (userId === req.params.userId || req.user.role === "admin") {
      await Promise.all([
        userModel.findByIdAndUpdate(userId, { isDelete: true }),
        postModel.updateMany({ userId }, { isDelete: true }),
        commentModel.updateMany({ userId }, { isDelete: true })
      ]);
      return res.json(getSuccessResponse("User Deleted Succesfully"));
    }else{
      throw createError.Unauthorized();
    }

  } catch (error) {
    next(error);
  }
};

