const {Order,CartItem} = require("../models/order");
const {dbErrorHandler} = require("../dbError/dbErrorHandler");
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

exports.orderById = (req,res,next,id)=>{
    Order.findById({_id:id})
        .populate('products.product','name price')
        .exec((err,order)=>{
            if (err || !order) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            req.order = order;
            next();
        })
}

exports.createOrder = (req,res)=>{
    // console.log(req.body);
    req.body.order.user = req.profile;
    order.save((error,data)=>{
        if(error || !data){
            return res.status(400).json({error:dbErrorHandler(error)})
        }
        const emailData = {
            to: ['traders12mania@gmail.com',req.body.order.user.email],
            from: 'traders12mania@gmail.com',
            subject: `A new order is received`,
            html: `
            <p>Customer name:${req.body.order.user.name}</p>
            <p>Total products: ${order.products.length}</p>
            <p>Total cost: ${order.amount}</p>
        `
        };
        sgMail.send(emailData);
        res.json(data);
    })
}
exports.listOrders = (req,res)=>{
    Order.find({})
    .populate("user","_id name email address")
    .sort("created")
    .exec((err,data)=>{
        if(err || !data){
            return res.status(400).json({error:dbErrorHandler(err)})
        }
        res.json(data);
    })
}
exports.getStatus = (req,res)=>{
    res.json(Order.schema.path('status').enumValues);
}
exports.updateStatus = (req,res)=>{
    Order.update({_id:req.body.orderId},{$set:{status:req.body.status}},(err,data)=>{
        if(err || !data){
            return res.status(400).json({error:dbErrorHandler(err)})
        }
        res.json(data);
    })
}



//To get Enum Values
//https://stackoverflow.com/questions/22242591/how-can-i-get-the-enum-values-from-a-mongoose-schema