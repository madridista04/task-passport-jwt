const Router = require('express');
const indexRouter = Router();
const {userRoute} = require('./user.route')
const {postRoute} = require('./post.route')
const {commentRoute} = require('./comment.route');


indexRouter.use("/users",userRoute);
indexRouter.use("/users/:userId/posts",postRoute);
indexRouter.use("/users/:userId/posts/:postId/comments",commentRoute);


exports.indexRouter = indexRouter;
