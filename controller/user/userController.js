const bcrypt = require("bcrypt");
const User = require("../../model/userModel");
const Product = require("../../model/productModel");
const Category = require("../../model/categoryModel");
const message = require("../../config/mailer");
const Wallet=require("../../model/walletModel")

const securePassword = async (password) => {
    try {
      const passwordHash = await bcrypt.hash(password, 10);
      return passwordHash;
    } catch (error) {
      console.log(error.message);
    }
  };
  

  // get register-----------------------
const loadRegister = async (req, res) => {
    try {
      res.render("user/register");
    } catch (error) {
      console.log(error.message);
    }
  };


  
// post register-----------------------
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
  }

// Resend OTP----------------------------------
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
    const page = parseInt(req.query.page) || 1;
    const limit = 6;

    const productData = await Product.find({ isVisible: true })
      .populate("category")
      .skip((page - 1) * limit)
      .limit(limit);

    const categories = await Category.find();
    const userData = await User.findById(userId);

    // Count total products
    const totalCount = await Product.countDocuments({ isVisible: true });
    const totalPages = Math.ceil(totalCount / limit);

    if (userData) {
      res.render("user/home", {
        userData,
        products: productData,
        categories,
        totalPages,
        currentPage: page,
      });
    } else {
      res.render("user/home", {
        userData: null,
        products: productData,
        categories,
        totalPages,
        currentPage: page,
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

  
  //  Load shop Page-----------------------

  const loadShop = async (req, res) => {
    try {
      const userId = req.session.user_id;
      const page = parseInt(req.query.page) || 1;
      const limit = 6;
  
      const productData = await Product.find({ isVisible: true })
        .populate("category")
        .skip((page - 1) * limit)
        .limit(limit);
  
      const categories = await Category.find();
      const userData = await User.findById(userId);
  
      // Count total products
      const totalCount = await Product.countDocuments({ isVisible: true });
      
      // Calculate totalPages
      const totalPages = Math.ceil(totalCount / limit);

  console.log(page,'............................');
      if (userData) {
        res.render("user/shop", {
          userData,
          products: productData,
          categories,
          totalPages,
          currentPage: page,
        });
      } else {
        res.render("user/shop", {
          userData: null,
          products: productData,
          categories,
          totalPages,
          currentPage: page,
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const loadWallets = async (req, res) => {
    try {
      const userId = req.session.user_id;
      const userData = await User.findById(userId);
  
      if (!userData) {
        return res.render("login", { userData: null });
      }
      const page = parseInt(req.query.page) || 1;
   
      const limit = 6;
      const totalCount = await Product.countDocuments();
      
      const totalPages = Math.ceil(totalCount / limit);
  
      const walletData = await Wallet.findOne({ user: userId }).sort({ date: -1 })
        .populate({
          path: 'transaction',
        }).skip((page - 1) * limit)
        .limit(limit);;
  
      if (!walletData) {
        return res.render("user/wallets", { userData, wallet: null,currentPage: 0 ,totalPages:0 });
      }
  
      res.render("user/wallets", { userData, wallet: walletData, totalPages ,
        currentPage: page, });
  
    } catch (err) {
      console.error("Error in loadWallets route:", err);
      res.status(500).send("Internal Server Error");
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
  
      res.render("user/singleProduct", { userData:(userData ? userData : null), product, categories });
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
      if (userData) {
        res.render("user/shop", {
          userData,
          products: productData,
          categories,
          totalPages,
          currentPage: page,
        });
      } else {
        res.render("user/shop", {
          userData: null,
          products: productData,
          categories,
          totalPages,
          currentPage: page,
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const loadprofile = async (req, res) => {
    try {
      const userId = req.session.user_id;
      const userData = await User.findById(userId);
      if (userData) {
        res.render("user/userProfile", { userData });
      } else {
        res.redirect("/login");
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  
  const userEdit = async (req, res) => {
    try {
      let id = req.body.user_id;
  
      const userData = await User.findById(id);
  
      const { name, mobile } = req.body;
  
      if(!req.file){
        const updateData = await User.findByIdAndUpdate(
          { _id: id },
          {
            $set: {
              name,
              mobile,
         
            },
          }
        );
      }
      else{
        const updateData = await User.findByIdAndUpdate(
          { _id: id },
          {
            $set: {
              name,
              mobile,
              image: req.file.filename,
            },
          }
        );
      }
  
    
  
      res.redirect("/userprofile");
    } catch (error) {
      console.log(error.message);
    }
  };
  

  
// GET load Forget password  Page-----------------------
const loadForgetpassword = async (req, res) => {
  try {
    res.render("user/forgotPassword");
  } catch (error) {
    console.log(error.message);
  }
};

// forgot Password OTP-----------------------
const forgotPasswordOTP = async (req, res) => {
  try {
    const emaildata = req.body.email;
    console.log("Email received:", emaildata);

    const userExist = await User.findOne({ email: emaildata });
    req.session.userData=userExist;
    req.session.user_id = userExist._id;
    if (userExist) {
      const data = await message.sendVarifyMail(req, userExist.email);
      return res.redirect("/otp");
    } else {
    
      res.render("user/forgotPassword", {
        error: "Attempt Failed",
        User: null,
      });
    }
  } catch (error) {
    console.log("Error:", error.message);
  }
};

// Get  Reset Password Page---------------------
const loadResetPassword = async (req, res) => {
  try {
    if (req.session.user_id) {
      const userId = req.session.user_id;
      console.log(userId, "ajay");
      const user = await User.findById(userId);

      res.render("user/resetPassword", { User: user });
    } else {
      res.redirect("/forgotPassword");
    }
  } catch (error) {
    console.log(error.message);
  }
};

// reset Password ------------------------------
const resetPassword = async (req, res) => {
  try {
    const user_id = req.session.user_id;
    const password = req.body.password;
    const secure_password = await securePassword(password);
    const updatedData = await User.findByIdAndUpdate(
      { _id: user_id },
      { $set: { password: secure_password } }
    );
    if (updatedData) {
      res.redirect("/userprofile");
    }
  } catch (error) {
    console.log(error.message);
  }
};

// update User Profile picture-------------------------------
const updateUserProfilepic = async (req, res) => {
  try {
    const userData = await User.findById(req.session.user_id);

    if (!req.file) {
      // Handle error if no file is received
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const croppedImage = req.file.filename;

    await User.findByIdAndUpdate(userData._id, {
      $set: {
        image: croppedImage,
      },
    });

    res.status(200).json({ success: true, message: 'Profile Picture changed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
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
    loadWallets,
    verifyOtp,
    verifyuserLogin,
    resendOTP,
    loadShop,
    loadShopCategory,
    loadSingleShop,
    loadprofile,
    userEdit,
    resetPassword,
    loadResetPassword,
    loadForgetpassword,
    forgotPasswordOTP,
    updateUserProfilepic 
   
  }