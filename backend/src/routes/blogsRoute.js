const { Router } = require('express');

const { getBlogs, createBlog, getBlogsById, updateBlog } = require('../controllers/blog');

const router = Router();

router.get('/getBlogs', getBlogs);
router.post('/create', createBlog);
router.get('/getBlog/:id', getBlogsById);
router.put('/updateBlog/:id', updateBlog);

module.exports = router;