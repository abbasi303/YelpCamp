const User = require('../models/user')

module,exports.renderRegister = async(req,res,next)=>{
    res.render('users/register')
}

module.exports.userRegister=async(req,res,next)=>{
    try{
    const {email,username,password} =req.body
    const user = new User({email,username});
    const registeredUser = await User.register(user,password);
    req.login(registeredUser,err=>{
        if(err) return next(err);
        req.flash('success','Welcome')
        res.redirect('/campgrounds')
    })

    }catch(e){
    req.flash('error',e.message)
    res.redirect('register')
    }
}

module.exports.renderLogin= async(req,res,next)=>{
    res.render('users/login')
}
module.exports.userLogin= async (req,res) =>{
    req.flash('success','Welcome Back')
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect('/campgrounds')
}

module.exports.userLogout=(req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
}
