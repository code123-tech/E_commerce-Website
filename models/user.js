const mongoose = require("mongoose");
const crypto = require("crypto") 
const { v4: uuidv4 } = require('uuid');  //Unique id Generation

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        maxlength:32,
        required:true
    },
    email:{
        type:String,
        unique:true,
        trim:true,
        required:true
    },
    hashed_password:{
        type:String,
        required:true
    },
    about:{
        type:String,
        trim:true
    },
    salt:String,
    role:{       //for check regualr user(0) is working or Admin(1) is Working on website.
        type:Number,
        default:0
    },
    history:{  //History for checking if user has made any purchase, so next time when user sign-ins, history comes.
        type:Array,
        default:[]
    }
},{timestamps:true});

userSchema.virtual("password")  //Creating Virtual Fields
.set(function(password){
    this._password = password
    this.salt = uuidv4(); 
    this.hashed_password = this.encryptedPassword(password);
})
.get(()=>{
    return this._password
})
//Now Adding Virtual Methods
userSchema.methods = {
    authenticate:function(password){
        return this.encryptedPassword(password) === this.hashed_password;
    },
    encryptedPassword:function(password){
        if(!password) return '';
        try {
            return crypto.createHmac('sha256',this.salt)
                                .update(password)
                                .digest('hex')
        } catch (error) {
            return '';
        }
    }
}
module.exports = mongoose.model("User",userSchema);

//Useful Links
//1. Crypto vs bcrypt - http://www.appstoremarketresearch.com/articles/node-js-tutorial-authentication-crypto-bcrypt/
//2. virtual Fields -  https://mongoosejs.com/docs/tutorials/virtuals.html
//3. Crypto-  https://nodejs.org/api/crypto.html
//4. uuid-  https://stackoverflow.com/questions/20342058/which-uuid-version-to-use
