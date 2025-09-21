const { Router } = require('express');

const { getBlogs, createBlog, getBlogsById, updateBlog, deleteBlog } = require('../controllers/blog');
const { userAuth, adminOnly } = require('../middlewares/auth-middleware');

const router = Router();

router.get('/getBlogs', getBlogs);
router.post('/create', userAuth, adminOnly, createBlog);
router.get('/getBlog/:id', getBlogsById);
router.put('/updateBlog/:id', userAuth, adminOnly, updateBlog);
router.delete('/deleteBlog/:id', userAuth, adminOnly, deleteBlog);

module.exports = router;