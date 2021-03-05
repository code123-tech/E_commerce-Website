"use strict";


exports.dbErrorHandler = (error)=>{
    if(error.code){
        return ("Error code: " + error.code + " User-Email already exist, please Try Different one");
    }else{
        return (error._message + ", Please Try Again.");
    }
}