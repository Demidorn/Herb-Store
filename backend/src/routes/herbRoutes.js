const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const herbController = require('../controllers/herbController');

// Herb CRUD
router.get('/', herbController.getHerbs);
router.get('/:id', herbController.getHerbById);
router.post('/', herbController.createHerb);
router.put('/:id', herbController.updateHerb);
router.delete('/:id', herbController.deleteHerb);

// Image management
router.post('/:id/images', upload.array('images', 10), herbController.uploadImages);
router.delete('/:herbId/images/:imageId', herbController.deleteImage);

module.exports = router;