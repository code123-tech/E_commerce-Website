const User = require("../models/user");
const jwt = require("jsonwebtoken");     //For Generating JwonWebtokens
const expressJwt = require("express-jwt");  //For Authoriztion Check
const {dbErrorHandler} = require("../dbError/dbErrorHandler");
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

exports.signup = (req,res)=>{
    const user = new User(req.body);
    user.save((err,user1)=>{
        if(err) {
            return res.status(404).json({err:dbErrorHandler(err)});
        }
        user1.salt = undefined;
        user1.hashed_password = undefined;
        const msg = {
            to: user1.email, // Change to your recipient
            from: 'traders12mania@gmail.com', // Change to your verified sender
            subject: 'SuccessFully Signed Up',
            text: 'Signed Up.',
            html: `<h1>${user.name}, You have been Registered Succesfully.</h1>`,
          }
          sgMail
          .send(msg)
          .then(() => {
            console.log('Email sent')
          })
          .catch((error) => {
            console.error(error)
          });
        res.json({user1});
    });
}

exports.signin = (req,res)=>{
    const {email,password} = req.body;
    User.findOne({email},(err,user)=>{
        if(err || !user){
            return res.status(400).json({error:"User with Email Doesn't exist, Please Signup."});
        }
        //Authenticate with email and password
        if(!user.authenticate(password)){
            return res.status(401).json({error:"Email or Password don't match."});
        }
        //Now Generating a token
        const token = jwt.sign({_id:user._id},process.env.SECRET);
        //Set Cookie
        res.cookie('userData',token,{expire:new Date()+9999});
        const {_id,name,email,role} = user;
        return res.json({token,user:{_id,name,email,role}});
    });
}

exports.signout = (req,res)=>{                                                                
    res.clearCookie('userData');
    res.json({message:"Signout Success"});
};
//Authorizarion using expressJwt
exports.requireSignin = expressJwt({
    secret:process.env.SECRET,
    userProperty:'auth',
    algorithms: ['HS256']
});
exports.isAuth = (req,res,next)=>{
    let user = req.profile && req.auth && req.profile._id == req.auth._id;
    if(!user){
        return res.status(403).json({error:"Access Denied"});
    }
    next();
}
exports.isAdmin = (req,res,next)=>{
    if(req.profile.role === 0){
        return res.status(403).json({error:"Admin Request Denied"});
    }
    next();
}

//Links
//1. jsonwebtokens -  https://www.sohamkamani.com/blog/javascript/2019-03-29-node-jwt-authentication/
//2. Cookies -   https://www.geeksforgeeks.org/http-cookies-in-node-js/
//3. Error in exports.requireSign of algroithms: 
// https://stackoverflow.com/questions/63460236/how-fix-this-if-options-algorithms-throw-new-erroralgorithms-should-be-se
//4. Tokens:  https://jasonwatmore.com/post/2020/06/17/nodejs-mongodb-api-jwt-authentication-with-refresh-tokens