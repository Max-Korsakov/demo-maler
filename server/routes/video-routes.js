const express = require('express');
const controller = require("../controllers/video");
const router = express.Router();

router.get('/poster', controller.setPoster)
router.get('/jsondata', controller.getData)
router.delete('/case', controller.deleteCase)
router.get('/getvideo', controller.getVideo)
router.get('/:id', controller.getCases)
router.get('/', controller.getProjects)


module.exports = router;