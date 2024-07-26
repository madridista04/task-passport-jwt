const createError = require('http-errors');
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const userModel = require('../models/user.model');
const { createAccessToken, createRefreshToken } = require('../utils/create-token');
require('dotenv').config();


passport.use(
    new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, async (email, password, cb) => {
        try {
            const valideEmail = await userModel.findOne({ email, isDelete: false });
            if (!valideEmail) throw createError(404, 'Email or Password not valid');

            const validePassword = await valideEmail.checkPassword(password);
            if (!validePassword) throw createError(404, 'Email or Password not valid');

            const jwtToken = createAccessToken(valideEmail._id.toString(), valideEmail.role);
            const refreshToken = createRefreshToken(valideEmail._id.toString(), valideEmail.role);

            cb(null, { jwtToken, refreshToken });
        } catch (error) {
            cb(error)
        }
    }),
)

passport.use("jwt",
    new JWTStrategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.ACCESS_TOKEN_KEY
    }, async (jwtPayload, cb) => {
        try {
            const user = await userModel.findOne({ _id: jwtPayload.userId })
            if (!user) throw createError.Unauthorized();

            cb(null, jwtPayload);
        } catch (error) {
            cb(error);
        }
    })
);

exports.authorization = (roles) => {
    return (req, res, next) => {
        try {
            const user = req.user;
            if (!roles.includes(user.role)) throw createError("Not Authorized");
            next();
        } catch (error) {
            next(error);
        }
    }
}





