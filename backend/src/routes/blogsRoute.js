const { Router } = require('express');

const { getBlogs, createBlog, getBlogsById, updateBlog, deleteBlog } = require('../controllers/blog');

const router = Router();

router.get('/getBlogs', getBlogs);
router.post('/create', createBlog);
router.get('/getBlog/:id', getBlogsById);
router.put('/updateBlog/:id', updateBlog);
router.delete('/deleteBlog/:id', deleteBlog);

module.exports = router;