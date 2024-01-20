const bcrypt = require("bcrypt");
const User = require("../../model/userModel");
const Product = require("../../model/productModel");
const Category = require("../../model/categoryModel");
const message = require("../../config/mailer");

const securePassword = async (password) => {
    try {
      const passwordHash = await bcrypt.hash(password, 10);
      return passwordHash;
    } catch (error) {
      console.log(error.message);
    }
  };
  

  // get register
const loadRegister = async (req, res) => {
    try {
      res.render("user/register");
    } catch (error) {
      console.log(error.message);
    }
  };


  
// post register
const insertUser = async (req, res) => {
    try {
      const email = req.body.email;
      const mobile = req.body.mobile;
      const name = req.body.name;
  
      const password = req.body.password;
      if (!email || !mobile || !name || !password) {
        return res.render("user/register", {
          message: "Please fill in all the fields",
        });
      }
  
      const existMail = await User.findOne({ email: email });
    
  
      if (existMail) {
        res.render("user/register", { message: "This user already exists" });
      } else {
        req.session.userData = req.body;
        req.session.register = 1;
        req.session.email = email;
        if (req.session.email) {
          const data = await message.sendVarifyMail(req, req.session.email);
          res.redirect("/otp");
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  

  // GET OTP PAGE
const loadOtp = async (req, res) => {
    try {
      res.render("user/otp");
    } catch (error) {
      console.log(error.message);
    }
  };

  
// VERIFYOTP
const verifyOtp = async (req, res) => {
    try {
      const userData = req.session.userData;
      const firstDigit = req.body.first;
      const secondDigit = req.body.second;
      const thirdDigit = req.body.third;
      const fourthDigit = req.body.fourth;
      const fullOTP = firstDigit + secondDigit + thirdDigit + fourthDigit;
  
      if (!req.session.user_id) {
        if (fullOTP == req.session.otp) {
          const secure_password = await securePassword(userData.password);
          const user = new User({
            name: userData.name,
            email: userData.email,
            mobile: userData.mobile,
            password: secure_password,
            image:'',
            isAdmin: 0,
            is_blocked: 1,
          });
  
          const userDataSave = await user.save();
          if (userDataSave && userDataSave.isAdmin === 0) {
            req.session.user_id = userDataSave._id;
            res.redirect("/login");
          } else {
           return  res.render("user/otp", { message: "Registration Failed" });
          }
        } else {
          return res.render("user/otp", { message: "invailid otp. Please enter the correct OTP." });
        }
      } else {
        if (fullOTP == req.session.otp) {
          res.redirect("/resetPassword");
        } else {
          return res.render("user/otp", { message: "invailid otp. Please enter the correct OTP." });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };



  const resendOTP = async (req, res) => {
    try {
      // Retrieve user data from session storage
      const userData = req.session.userData;
  
      if (!userData) {
        res.status(400).json({ message: "Invalid or expired session" });
      } else {
        delete req.session.otp;
        const data = await message.sendVarifyMail(req, userData.email);
      }
  
      // Generate and send new OTP using Twilio
  
      res.render("user/otp", { message: "OTP resent successfully" });
    } catch (error) {
      console.error("Error: ", error);
      res.render("user/otp", { message: "Failed to send otp" });
    }
  };
  


  
// GET LOGIN
const loadLogin = async (req, res) => {
    try {
      res.render("user/login", { message: "" }); 
    } catch (error) {
      console.log(error.message);
    }
  };


  // ---------verify user Login----------------
  const verifyuserLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        return res.render("user/login", {
          message: "Please fill in all the fields",
        });
      }
  
      const userData = await User.findOne({ email: email });
  
      if (userData) {
        // Check if the user is blocked by admin
        if (userData.is_blocked === 0) {
          return res.render("user/login", {
            message: "Admin has blocked this user. Contact admin for assistance.",
          });
        }
  
        const passwordMatch = await bcrypt.compare(password, userData.password);
  
        if (passwordMatch && userData.isAdmin === 0 && userData.is_blocked == 1) {
          req.session.user_id = userData._id;
          res.redirect("/");
        } else {
         return res.render("user/login", {
            message: "Email and password are incorrect",
          });
        }
      } else {
        return res.render("user/login",{
          message:"user not found",
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  
  

//   load Home page-------------------------
  const loadHome = async (req, res) => {
    try {
      const userId = req.session.user_id;
      const productData = await Product.find().populate("category");
      const categories = await Category.find();
      
      
      const userData = await User.findById(userId);
    
      if (userData) {
        res.render("user/home", { userData,products: productData,categories });
      } else {
        res.render("user/home", { userData: null,products: productData,categories});
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  //  Load shop Page-----------------------
  const loadShop = async (req, res) => {
    try {
      const userId = req.session.user_id;
      const userData = await User.findById(userId);
      const productData = await Product.find().populate("category");
      console.log(productData,"klkkl");
      const categories = await Category.find();
      res.render("user/shop", { products: productData, userData, categories});
    } catch (error) {
      console.log(error.message);
    }
  };

//show single product in user side--------------- 
  const loadSingleShop = async (req, res) => {
    try {
      const userId = req.session.user_id;
      const userData = await User.findById(userId);
      const productId = req.params.id;
      const product = await Product.findById(productId);
      const categories = await Category.find().exec();
  
      res.render("user/singleProduct", { userData, product, categories });
    } catch (error) {
      console.log(error.message);
    }
  };

  // load Shop Category----------------------
  const loadShopCategory = async (req, res) => {
    try {
      const userId = req.session.user_id;
      const userData = await User.findById(userId);
      const categoryId = req.query.id;
      const productData = await Product.find({category:categoryId});
      const categories = await Category.find();
      res.render("user/shop", { products: productData, userData, categories});
    } catch (error) {
      console.log(error.message);
    }
  };


  // User Logout------------------------ 
  const userLogout = async (req, res) => {
    try {
      req.session.destroy();
  
      res.redirect("/login");
    } catch (error) {
      console.log(error.message);
    }
  };
  

  module.exports = {
    loadLogin,
    userLogout,
    insertUser,
    loadRegister,
    loadHome,
    loadOtp,
    verifyOtp,
    verifyuserLogin,
    resendOTP,
    loadShop,
    loadShopCategory,
    loadSingleShop
   
  }