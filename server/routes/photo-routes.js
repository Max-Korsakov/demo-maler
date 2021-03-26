const express = require('express');
const controller = require("../controllers/photo");
const router = express.Router();

router.get('/jsondata', controller.getData)
router.get('/poster', controller.getPoster)
router.delete('/case', controller.deleteCase)
router.get('/getone', controller.getPhoto)
router.get('/:id', controller.getCases)
router.get('/', controller.getProjects)


module.exports = router;