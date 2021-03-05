const Category = require("../models/category");
const Product = require("../models/product");
const {dbErrorHandler} = require("../dbError/dbErrorHandler");

//Finding Category by id
exports.categoryById = (req,res,next,id)=>{
    Category.findById(id).exec((err,category)=>{
        if(err || !category){
            return res.status(400).json({error:"Category Doesn't exist"});
        }
        req.category = category;
        next();
    });
};
//Create Category
exports.create = (req,res)=>{
    const category = new Category(req.body);
    category.save((err,data)=>{
        if(err){
            return res.status(400).json({error:"Category Already Present!"});
        }
         res.json({data});
    });
};
//read Category
exports.read = (req,res)=>{
    return res.json(req.category);
}
//Update Category
exports.update = (req,res)=>{
    const category = req.category;
    category.name = req.body.name;
    category.save((err,result)=>{
        if (err) {
            return res.status(400).json({error: dbErrorHandler(err)});
        }
        res.json(result);
    });
};
//REMOVE Category
exports.remove = (req,res)=>{
    const category = req.category;
    Product.find({category}).exec((err,data)=>{
        if(data.length >=1 ){
            return res.status(400).json({
                message:`Sorry, You  can't delete ${category.name}. It has ${data.length} associated Products.`
            });
        }else{
            category.remove((err,data)=>{
                if(err){
                    return res.status(400).json({error:dbErrorHandler(err)});
                }
            })
            res.json({message:"Category Deleted Successfully"});
        }
    });
}
//List Of Categories
exports.list = (req,res)=>{
    Category.find({}).exec((err,data)=>{
        if (err) {
            return res.status(400).json({error: dbErrorHandler(err)});
        }
        res.json(data);
    });
}
