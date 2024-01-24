const express = require('express');
const userRoute=express.Router();
const addressController=require('../controller/user/addressController')
const userController = require('../controller/user/userController');
const cartController = require('../controller/user/cartController')
const orderController=require('../controller/user/orderController')

const { islogin, islogout } = require('../middleware/userAuth');
const multer=require('../middleware/multer')

// Registration
userRoute.get('/register', islogout, userController.loadRegister);
userRoute.post('/register', userController.insertUser);

userRoute.get('/otp',userController.loadOtp );
userRoute.post('/otp',userController.verifyOtp );
userRoute.get('/resendOTP',userController.resendOTP );
userRoute.get('/logout',islogin,userController.userLogout );


// user
userRoute.get('/userprofile',userController.loadprofile );
userRoute.post('/userprofile',multer.uploadUser.single('image'), userController.userEdit );
userRoute.get('/userAddress',addressController.loadAddress );
userRoute.get('/addAddress',addressController.loadAddAddress );
userRoute.post('/addAddress',addressController.addAddress );
userRoute.get('/editAddress',addressController.loadEditAddress );
userRoute.post('/editAddress',addressController.editAddress );
userRoute.get('/deleteAddress',addressController.deleteAddress );





 // user login
userRoute.get('/login',islogout,userController.loadLogin );
userRoute.post('/login',userController.verifyuserLogin );

// Home
userRoute.get('/', userController.loadHome);
userRoute.get('/shop',userController.loadShop );
userRoute.get('/singleProduct/:id',userController.loadSingleShop );


// cart
userRoute.get("/cart",cartController.loadCartPage);
userRoute.post('/cart',cartController.addTocart );
userRoute.put("/updateCart", cartController.updateCartCount);
userRoute.delete("/removeCartItem", cartController.removeFromCart);

// checkout---order------------------
userRoute.get('/checkout',orderController.loadCheckout );
userRoute.post('/checkout',orderController.checkOutPost );

userRoute.get('/orderSuccess',orderController.loadOrderDetails );
userRoute.get('/orderDetails/:id',orderController.loadOrderHistory );
userRoute.get('/orderCancel',orderController.orderCancel );

module.exports = userRoute;
