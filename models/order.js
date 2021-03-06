const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema;

const cartItemSchema = new mongoose.Schema({
    product:{type:ObjectId,ref:"Product"},
    name:String,
    price:Number,
    count:Number
},{timestamps:true});

const CartItem = mongoose.model("CartItem",cartItemSchema);

const OrderItem = new mongoose.Schema({
    products:[cartItemSchema],
    transaction_id:{},
    amount:{type:Number},
    address:String,
    status:{
        type:String,
        default:"Not Processed",
        enum:["Not Processed","Processing","Shipped","Delivered","Cancelled"]
    },
    update:Date,
    user:{type:ObjectId,ref:"User"}
},{timestamps:true});

const Order = mongoose.model("Order",OrderItem);
module.exports = {CartItem,Order};