const express = require("express");
const router = express.Router();

const {
    read,
    create,
    remove,
    update,
    productById,
    list,
    listSearch,
    listRelated,
    listCategory,
    listBySearch,
    photo} = require("../controllers/product");
const { requireSignin, isAuth, isAdmin} = require("../controllers/auth");
const {userById} = require("../controllers/user");


//Creating CRUD operation on Products(it requires authentication and admin can do it.)
router.post("/product/create/:userid",requireSignin,isAuth,isAdmin,create);
router.get("/product/:productId",read);
router.put("/product/:productId/:userid",requireSignin,isAuth,isAdmin,update);
router.delete("/product/:productId/:userid",requireSignin,isAuth,isAdmin,remove);


//here client can make any filter using this type of requests.
router.get("/products",list);
router.get("/products/search",listSearch);
router.get("/products/related/:productId",listRelated);
router.get("/products/categories",listCategory);
router.get("/product/photo/:productId",photo);
router.post("/products/by/search",listBySearch);


router.param("userid",userById);
router.param("productId",productById);
module.exports = router;