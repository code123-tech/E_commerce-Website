const express = require("express");
const router = express.Router();
const { requireSignin,isAuth, isAdmin} = require("../controllers/auth");
const {createOrder} = require("../controllers/order");
const {userById,addIntoPurchaseHitory} = require("../controllers/user");
const {updateProductQuantity} = require("../controllers/product");
const {listOrders,orderById,updateStatus,getStatus} = require("../controllers/order");

router.post("/order/create/:userid",requireSignin,isAuth,addIntoPurchaseHitory,updateProductQuantity,createOrder);
router.get("/order/list/:userid",requireSignin,isAuth,isAdmin,listOrders);

router.get("/order/status-values/:userid",requireSignin,isAuth,isAdmin,getStatus);
router.put("/order/:orderId/status/:userid",requireSignin,isAuth,isAdmin,updateStatus);

router.param("userid",userById);
router.param("orderId",orderById);
module.exports = router;