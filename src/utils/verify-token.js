const createError = require("http-errors");
const jwt = require('jsonwebtoken');
const client = require('./redis-init');
const userModel = require('../models/user.model')

// exports.checkAccessToken = async (req, res, next) => {
//     try {
//         const token = req.headers.authorization?.split(' ')[1];
//         if (!token) throw createError(401, "Access- Denied");
//         const decode = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);

//         const user = await userModel.findOne({ _id: decode.userId, isDelete: false }).lean();
//         if (!user) throw createError.Unauthorized();

//         req.user = user;
//         next();
//     } catch (error) {
//         next(error)
//     }
// }

exports.checkRefreshToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) throw createError(401, "Access- Denied");

        const decode = jwt.verify(token, process.env.REFRESH_TOKEN_KEY);

        const storedKey = await client.get(decode.userId);
        if (storedKey !== token) throw createError.Unauthorized();

        const user = await userModel.findOne({ _id: decode.userId, isDelete: false }).lean();
        if (!user) throw createError.Unauthorized();
        req.user = user;

        next();
    } catch (error) {
        next(error)
    }
}