const express = require("express");
const router = express.Router();
const {handleDealerDetail, handleDealerDetailForAdmin} = require("../controller/dealer")
router.post("/",handleDealerDetail);
router.get("/getUser",handleDealerDetailForAdmin);
module.exports = router;