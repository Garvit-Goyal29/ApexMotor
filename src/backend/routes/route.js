const express = require("express");
const router = express.Router();
const {handleDealerDetail} = require("../controller/dealer")
router.post("/",handleDealerDetail);

module.exports = router;