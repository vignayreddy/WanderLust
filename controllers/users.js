const User = require("../models/user.js");


module.exports.renderSignupForm =  (req, res) => {
    res.render("./users/signup.ejs");
}


module.exports.signup = 
    async (req, res, next) => {
          try{
    const { username, email, password } = req.body;

    const newUser = new User({ username, email });
    const registeredUser = await User.register(newUser, password); // This can throw if username exists

    console.log(registeredUser);
    req.login(registeredUser, (err)=>{

            if(err){
                return next(err);
            }
            req.flash("success", "Welcome to WanderLust");
    res.redirect(req.session.redirectUrl);

    })

    
    }
    catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}


module.exports.renderLoginForm = (req,res)=>{
    res.render("./users/login.ejs");
}

module.exports.login = (req,res)=>{

req.flash("success","Welcome to wanderlust You are logged in");

let redirectUrl = req.session.redirectUrl || "/";
res.redirect("/listings");

}


module.exports.logout = (req,res)=>
{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Logged out");
        res.redirect("/listings");
    });
}
