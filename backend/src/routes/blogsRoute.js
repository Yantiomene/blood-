const { Router } = require('express');

const { getBlogs, createBlog, getBlogsById, updateBlog, deleteBlog, likeBlog, getBlogComments, createBlogComment, deleteBlogComment, likeBlogComment, generateBlogContentAI, uploadBlogImage } = require('../controllers/blog');
const { userAuth, adminOnly } = require('../middlewares/auth-middleware');

const router = Router();

router.get('/getBlogs', getBlogs);
router.post('/create', userAuth, adminOnly, createBlog);
router.get('/getBlog/:id', getBlogsById);
router.put('/updateBlog/:id', userAuth, adminOnly, updateBlog);
router.delete('/deleteBlog/:id', userAuth, adminOnly, deleteBlog);

// Likes and comments
router.post('/:id/like', likeBlog);
router.get('/:id/comments', getBlogComments);
router.post('/:id/comments', userAuth, createBlogComment);
router.delete('/:id/comments/:commentId', userAuth, adminOnly, deleteBlogComment);
router.post('/:id/comments/:commentId/like', likeBlogComment);
// Admin-only AI content generation
router.post('/:id/generate', userAuth, adminOnly, generateBlogContentAI);

// Admin-only image upload endpoint (base64 JSON)
router.post('/upload', userAuth, adminOnly, uploadBlogImage);

module.exports = router;