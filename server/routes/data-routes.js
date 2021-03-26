const express = require('express');
const controller = require("../controllers/data");
const router = express.Router();

router.get('/standard', controller.getStandardData)
router.get('/correction', controller.getCorrectionData)
router.get('/:id', controller.getData)
router.post('/:id', controller.saveStandardData)


module.exports = router;