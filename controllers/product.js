const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const { dbErrorHandler } = require("../dbError/dbErrorHandler");
const router = require("../routes/product");


//CREATE PRODUCT
exports.create = (req,res)=>{
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req,(err,fields,files)=>{
        if(err){
            return res.status(400).json({error:"Image could not be uploaded"});
        }
        // console.log(fields);
        const {name,description,price,category,quantity,shipping} = fields;
        if(!name || !description || !price || !category || !quantity || !shipping){
            return res.status(400).json({error:'All Fields are required'});
        }
        let product = new Product(fields);
        if(files.photo){
            if(files.photo.size>1000000){
                return res.status(400).json({error: 'Image should be less than 1mb in size'
                });
            }
            product.photo.data = fs.readFileSync(files.photo.path);
            product.photo.type = files.photo.type;
        }   
        product.save((err,result)=>{
            if(err){
                return res.status(400).json({error:dbErrorHandler(err)})
            }
            res.json({result});
        });
    });
};

//PRODUCT by ProductId
exports.productById = (req,res,next,id)=>{
    Product.findById({_id:id})
        .populate('category')
        .exec((err,product)=>{
            if(err || !product){
                return res.status(400).json({error:"product not found"});
            }
            req.product = product;
            next();
        })
}
//READ PRODUCT
exports.read = (req,res)=>{
    req.product.photo = undefined;
    return res.json(req.product);
}

//DELETE PRODUCT
exports.remove = (req,res)=>{
    let product = req.product;
    product.remove((err,deletedproduct)=>{
        if(err){
            return res.status(400).json({error:dbErrorHandler(err)});
        }
    })
    res.json({message:"Product Deleted Successfully"});
};

//UPDATE PRODUCT
exports.update = (req,res)=>{
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req,(err,fields,files)=>{
        if(err){
            return res.status(400).json({error:"Image could not be uploaded"});
        }
        
        let product = req.product;
        product = _.extend(product,fields); 

        if(files.photo){
            if(files.photo.size>1000000){
                return res.status(400).json({error: 'Image should be less than 1mb in size'
                });
            }
            product.photo.data = fs.readFileSync(files.photo.path);
            product.photo.type = files.photo.type;
        }   

        product.save((err,result)=>{
            if(err){
                return res.status(400).json({error:dbErrorHandler(err)})
            }
            res.json({result});
        });
    });
};
/**
 *Now For Products Displaying we will use Query in routes.
 *Products Based on Sell/Arrival
 *by sell - "/products?sortBy=sold&order=desc&limit=4"
 *by arrival - "/products?sortBy=createdAt&order=desc&limit=4"
 */

exports.list = (req,res)=>{
    let sortBy = req.query.sortBy?req.query.sortBy:'_id';
    let order = req.query.order?req.query.order:'asc';
    let limit = req.query.limit?parseInt(req.query.limit):8;
    Product.find()
    .select('-photo')
    .populate('category')
    .sort([[sortBy,order]])
    .limit(limit)
    .exec((err,products)=>{
        if(err || !products){
            return res.json({error:dbErrorHandler(err)});
        }
        res.json({products});
    });
};

/*
* Find the Product Based on the Request Product Category
*Other Product that has same category will be returned
*/
exports.listRelated = (req,res)=>{
    let limit = req.query.limit?parseInt(req.query.limit):8;
    Product.find({_id:{$ne:req.product},category:req.product.category})
        .limit(limit)
        .populate('category','_id name')
        .exec((err,products)=>{
            if(err)
                return res.status(400).json({error:"Products not Found"});    
            res.json(products);
        });
}
//Products By Category
exports.listCategory = (req,res)=>{
    Product.distinct('category',{},(err,categories)=>{
        if(err){
            return res.status(400).json({error:"Categories not Found"});
        }
        res.json(categories);
    })
}

/**
 * Products By Search
 * Showing Categories in checkbox and price in range Format in Frontend
 * as user clicks on them, through API request user will get products
 */
 exports.listBySearch = (req,res)=>{ 
    let sortBy = req.query.sortBy?req.query.sortBy:'_id';
    let order = req.query.order?req.query.order:'asc';
    let limit = req.body.limit?parseInt(req.body.limit):100;
    let skip = parseInt(req.body.skip);
    let Args = {};
    for (let key in req.body.filters){
        if(req.body.filters[key].length>0){
            if(key=='price'){
                Args[key]={
                    $gte:req.body.filters[key][0],
                    $lte:req.body.filters[key][1]
                }
            }else{
                Args[key] = req.body.filters[key];
            }
        }
    }
    Product.find(Args)
        .select('-photo')
        .populate('category')
        .sort([[sortBy,order]])
        .skip(skip)
        .limit(limit)
        .exec((err,data)=>{
            if(err){
                return res.status(400).json({error:"Products not Found"});
            }
            res.json({
                size:data.length,
                data
            });
        });
 };

//GET Product Photo
exports.photo = (req,res,next)=>{
    if(req.product.photo.data){
        res.set('Content-Type',req.product.photo.type);
        return res.send(req.product.photo.data);
    }
    next();
};

//List Search
exports.listSearch = (req,res)=>{
    let query = {};
    if(req.query.search){
        query.name = {$regex:req.query.search,$options:"i"};
        if(req.query.category && req.query.category !== "All"){
            query.category = req.query.category;
        }
        Product.find(query,(err,products)=>{
            if(err){
                return res.status(400).json({error:dbErrorHandler(err)});
            }
            res.json(products);
        }).select('-photo')
    }
}
exports.updateProductQuantity = (req,res,next)=>{
    let updates = req.body.order.products.map(item=>{
        return{
            updateOne:{
                filter:{_id:item._id},
                update:{$inc:{quantity:-item.count,sold:+item.count}}
            }
        }
    });
    Product.bulkWrite(updates,{},(err,updatedProducts)=>{
        if (err) {
            return res.status(400).json({
                error: 'Could not update product'
            });
        }
        next();
    })
}
//Formidable
//1. https://www.geeksforgeeks.org/how-to-upload-file-using-formidable-module-in-node-js/
//2. lodash extend = https://dustinpfister.github.io/2018/10/01/lodash_extend/
//3. distinct category-  https://stackoverflow.com/questions/6043847/how-do-i-query-for-distinct-values-in-mongoose
//4. Bulkwrite = https://mongoosejs.com/docs/api.html#model_Model.bulkWrite
//5. https://stackoverflow.com/questions/56431685/whats-the-difference-between-updatemany-and-bulkwrite-in-mongoose#:~:text=This%20is%20faster%20than%20sending,one%20round%20trip%20to%20MongoDB.&text=Same%20as%20update()%2C%20except,value%20of%20the%20multi%20option.