const Router = require('express');
const { validate } = require('express-validation');
const { getUserWithId,
        addUser, 
        updateUser, 
        deleteUser, 
        getAllUsers, 
        loginUser,
        getTokenFromRefreshToken
    } = require('../controllers/user.controller');
const { 
    addUserValidation,
    getUserWithIdValidation,
    deleteUserValidation,
    updateUserValidation,
    getUsersValidation,
} = require('../validations/user.validation');
const { authorization } = require('../middelwares/user-auth');
const { checkRefreshToken } = require('../utils/verify-token');
const passport = require('passport');

const userRoute = Router();

userRoute.get('/', 
            validate(getUsersValidation, {}, { allowUnknown: false, abortEarly: true }),
            passport.authenticate('jwt', {session:false}),
            authorization(['user','admin']), 
            getAllUsers);

userRoute.post('/login',passport.authenticate('local', {session:false}),loginUser);

userRoute.get('/refresh',checkRefreshToken, getTokenFromRefreshToken);

userRoute.post('/', validate(addUserValidation), addUser);

userRoute.get('/:userId',
            validate(getUserWithIdValidation),
            passport.authenticate('jwt', {session:false}),
            authorization(['user','admin']), 
            getUserWithId);

userRoute.put('/:userId', 
            validate(updateUserValidation),
            passport.authenticate('jwt', {session:false}),
            authorization(['user']), 
            updateUser);
            
userRoute.delete('/:userId', 
            validate(deleteUserValidation),
            passport.authenticate('jwt', {session:false}),
            authorization(['user','admin']), 
            deleteUser);

exports.userRoute = userRoute;