const express = require("express");
const router = express.Router();
const { requireSignin, isAuth} = require("../controllers/auth");
const {read,userById,update,purchaseHistory} = require("../controllers/user");


router.get("/user/:userid",requireSignin,isAuth,read);
router.put("/user/:userid",requireSignin,isAuth,update);
router.get("/orders/by/user/:userid",requireSignin,isAuth,purchaseHistory);

router.param("userid",userById);

module.exports = router;