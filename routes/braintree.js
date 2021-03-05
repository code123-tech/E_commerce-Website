const express = require("express");
const router = express.Router();
const { requireSignin,isAuth} = require("../controllers/auth");
const { generateToken,processPayment} = require("../controllers/braintree");
const {userById} = require("../controllers/user");

router.get("/braintree/getToken/:userid",requireSignin,isAuth,generateToken);
router.post("/braintree/payment/:userid",requireSignin,isAuth,processPayment);

router.param("userid",userById);
module.exports = router;