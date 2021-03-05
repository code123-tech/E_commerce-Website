const express = require("express");
const router = express.Router();

const {create,categoryById,read,update,remove,list} = require("../controllers/category");
const { requireSignin, isAuth, isAdmin} = require("../controllers/auth");
const {userById} = require("../controllers/user");
//method of Router
router.get("/category/:categoryId",read);  
router.post("/category/create/:userid",requireSignin,isAuth,isAdmin,create);
router.put("/category/:categoryId/:userid",requireSignin,isAuth,isAdmin,update);
router.delete("/category/:categoryId/:userid",requireSignin,isAuth,isAdmin,remove);

router.get("/categories",list);


router.param("categoryId",categoryById);
router.param("userid",userById);

module.exports = router;