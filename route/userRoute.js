const express = require('express');
const userRoute=express.Router();
const userController = require('../controller/user/userController');
const { islogin, islogout } = require('../middleware/userAuth');

// Registration
userRoute.get('/register', islogout, userController.loadRegister);
userRoute.post('/register', userController.insertUser);

userRoute.get('/otp',userController.loadOtp );
userRoute.post('/otp',userController.verifyOtp );
userRoute.get('/resendOTP',userController.resendOTP );
userRoute.get('/logout',islogin,userController.userLogout );

 // user login
userRoute.get('/login',islogout,userController.loadLogin );
userRoute.post('/login',userController.verifyuserLogin );

// Home
userRoute.get('/', userController.loadHome);
userRoute.get('/shop',userController.loadShop );
userRoute.get('/singleProduct/:id',userController.loadSingleShop );

module.exports = userRoute;
