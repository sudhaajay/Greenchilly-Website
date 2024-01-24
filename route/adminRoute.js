const express = require("express");
const adminRoute = express();
const adminController = require("../controller/admin/adminController");
const categoryController=require("../controller/admin/categoryController");
const productController=require('../controller/admin/productController');
const orderController=require('../controller/admin/orderController');
const multer=require('../middleware/multer');
const adminAuth = require("../middleware/adminAuth");

// LOGIN
adminRoute.get("/", adminAuth.isLogout, adminController.loadAdminLogin);
adminRoute.post("/", adminController.verifyadminLogin);
adminRoute.get("/logout", adminController.adminLogout);


// user
adminRoute.get("/userData", adminAuth.isLogin, adminController.loadUserpage);
adminRoute.get('/unlistUser',adminAuth.isLogin,adminController.listUser)


// HOME
adminRoute.get("/home", adminAuth.isLogin, adminController.loadHome);


// Add Products
adminRoute.get("/products", adminAuth.isLogin,productController.loadProducts);
adminRoute.get("/addproduct", adminAuth.isLogin, productController.loadPorductForm);
adminRoute.post("/addproduct",multer.uploadProduct.array('image'), productController.addProduct);
adminRoute.get("/editProduct",adminAuth.isLogin, productController.loadEditPorductForm);
adminRoute.post("/editProduct",multer.uploadProduct.array('image'), productController.storeEditProduct);
adminRoute.get("/deleteProduct/:id",adminAuth.isLogin, productController.deleteProduct);
adminRoute.get("/visibleProduct/:id",adminAuth.isLogin, productController.productVisible);



// Add Category
adminRoute.get("/category", adminAuth.isLogin, categoryController.loadCategory);
adminRoute.get("/addCategory", adminAuth.isLogin, categoryController.loadCategoryform);
adminRoute.post("/addCategory",multer.uploadCategory.single('image'), categoryController.addCategory);
adminRoute.get("/editCategory",adminAuth.isLogin,categoryController.loadEditCategory);
adminRoute.post("/editCategory",multer.uploadCategory.single('image'), categoryController.CategoryEdit);
adminRoute.get('/unlistCategory',adminAuth.isLogin,categoryController.unlistCategory)


// All ORDERS
adminRoute.get("/alluserorders", adminAuth.isLogin, orderController.listUserOrders);
adminRoute.get("/orderDetails", adminAuth.isLogin, orderController.listOrderDetails);
adminRoute.get("/orderStatusChange", adminAuth.isLogin, orderController.orderStatusChange);


module.exports = adminRoute;
