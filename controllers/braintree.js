const User = require("../models/user");
const braintree = require("braintree");

const gateway =new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY
});

exports.generateToken = (req,res)=>{
    gateway.clientToken.generate({}, (err, response) => {
        if(err){
            res.status(500).send(err);
        }else{
            res.status(200).send(response);
        }
    });
}

exports.processPayment = (req,res)=>{
    gateway.transaction.sale({
        amount: req.body.amount,
        paymentMethodNonce: req.body.paymentMethodNonce,
        options: {
          submitForSettlement: true
        }
    }).then(result=>{
        if(result.success)
            res.status(200).json(result);
        else
            res.status(500).json(result);
    }).catch(err=>{
        res.status(500).json(err);
    });
}


// https://www.npmjs.com/package/braintree