const {Router} = require('express');
const { addPost, getPostWithId, updatePost, deletePost, getPost } = require('../controllers/post.controller');

const postRoute = Router({ mergeParams: true });

postRoute.get('/',getPost);
postRoute.post('/', addPost);
postRoute.get('/:postId', getPostWithId);
postRoute.put('/:postId', updatePost);
postRoute.delete('/:postId', deletePost);

exports.postRoute = postRoute;