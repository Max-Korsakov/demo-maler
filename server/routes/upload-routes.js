const express = require("express");
const controller = require("../controllers/upload");
const router = express.Router();


router.post("/", controller.uploadNewCase);

module.exports = router;


