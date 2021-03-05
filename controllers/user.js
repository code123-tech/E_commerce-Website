const User = require("../models/user");
const {Order} = require("../models/order");

exports.userById = (req,res,next,id)=>{
    User.findById({_id:id}).exec((err,user)=>{
        if(err || !user){
            return res.status(400).json({error:"User not found"});
        }
        req.profile = user;
        next();
    });
}

exports.read = (req,res)=>{
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    return res.json(req.profile);
}

exports.update = (req,res)=>{       
    const {name,email,password} = req.body;
    User.findOne({_id:req.profile._id},(err,user)=>{
        if(err || !user)
            return res.status(400).json({error:'User Not Found'});
        if(!name){
            return res.status(400).json({error:'Name is Required'});
        }else{
            user.name = name;
        }

        if(!password){
            return res.status(400).json({error:'Password is Required'});
        }else{
            user.password = password;
        }
        if(!email){
            return res.status(400).json({error:'Email is Required'});
        }
        else{
            user.email = email;
        }
        user.save((err,updatedUser)=>{
            if(err){
                return res.status(400).json({ error: 'User update failed'});
            }
            updatedUser.hashed_password = undefined;
            updatedUser.salt = undefined;
            res.json(updatedUser);
        });
    });
}

exports.addIntoPurchaseHitory = (req,res,next)=>{
    let history = [];
    req.body.order.products.forEach(item=>{
        history.push({
            _id:item._id,
            name:item.name,
            description:item.description,
            quantity:item.count,
            category:item.category,
            transaction_id:req.body.order.transaction_id,
            amount:req.body.order.amount
        });
    });

    User.findOneAndUpdate({_id:req.profile._id},{$push:{history:history}},{new:true},(err,data)=>{
        if(err){
            return res.status(500).json({error:"Unable to Update User Purchase History"});
        }
        next();
    });
}

exports.purchaseHistory = (req,res)=>{
    // console.log(req);
    Order.find({user:req.profile._id})
        .populate('user','_id name')
        .sort("-created")
        .exec((err,orders)=>{
            if(err || !orders){
                return res.status(400).json({error:"User Purchase Not found"});
            }
            res.json(orders);
     });
}