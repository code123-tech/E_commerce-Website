exports.userSignupValidator = (req,res,next) =>{
        req.check('name',"Name is required").notEmpty();
        req.check('email','Email must be between 4 to 32 characters.')
            .matches(/.+\@.+\..+/)
            .withMessage('Email must contain @')
            .isLength({
                min:4,
                max:32
            });
        req.check('password','Password is required').notEmpty();
        req.check('password')
            .isLength({min:6})
            .withMessage("Password must contain at least 6 characters")
            .matches(/\d/)
            .withMessage("Password must contain a number");
        const errors = req.validationErrors();  
        if(errors){
            const firstError = errors.map(err=>err.msg)[0];
            return res.status(400).json({error:firstError});
        }
        next();   //Links are Given Below.
}

//1. https://express-validator.github.io/docs/check-api.html#checkfields-message
//2. https://stackoverflow.com/questions/48747230/best-way-to-check-if-input-has-spaces-and-display-error-message-with-express
//3. https://stackoverflow.com/questions/50590466/express-validator-how-to-get-req-validationerrors-to-front-side