const bcrypt = require("bcrypt");
const User = require("../../model/userModel");
const sharp = require('sharp');
const Category = require("../../model/categoryModel");
const Order = require("../../model/orderModel");
const Product = require("../../model/productModel");


const {
  getDailyDataArray,

  getMonthlyDataArray,
  getYearlyDataArray,
} = require("../../config/chartData");


const loadAdminLogin = async (req, res) => {
  try {
    res.render("admin/login");
  } catch (error) {
    console.log(error.message);
 
  }
};

const verifyadminLogin = async (req, res) => {

  try {
    const { email, password } = req.body;

    const adminData = await User.findOne({ email: email });

    if (adminData) {
      const passwordMatch = await bcrypt.compare(password, adminData.password);
      if (passwordMatch && adminData.isAdmin === 1) {
    
        req.session.admin_id = adminData._id;

        res.redirect("/admin/home");
      } else {
        res.render("admin/login", {
          message: "Email and password are incorrect",
        });
      }
    } else {
      res.render("admin/login");
    }
  } catch (error) {
    console.log(error.message);
  }
};

const loadHome = async (req, res) => {
  try {
    let query = {};
    const adminData = await User.findById(req.session.admin_id);

    const totalRevenue = await Order.aggregate([
      { $match: {    "items.status": "Delivered"  } },
      { $group: { _id: null, totalAmount: { $sum: "$totalAmount" } } },
    ]);

    
    const totalUsers = await User.countDocuments({ is_blocked: 1});
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalCategories = await Category.countDocuments();
    const orders = await Order.find().populate("user").limit(10).sort({ orderDate: -1 });

    const monthlyEarnings = await Order.aggregate([
      {
        $match: {
          "items.status": "Delivered" ,
          orderDate: {
            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      },
      { $group: { _id: null, monthlyAmount: { $sum: "$totalAmount" } } },
    ]);
    const totalRevenueValue =
    totalRevenue.length > 0 ? totalRevenue[0].totalAmount : 0;
  const monthlyEarningsValue =
    monthlyEarnings.length > 0 ? monthlyEarnings[0].monthlyAmount : 0;

    const newUsers = await User.find({ is_blocked: 1,isAdmin:0  })
      .sort({ date: -1 })
      .limit(5);
       // Get daily data
       const dailyDataArray = await getDailyDataArray();
      // Get monthly data
      const monthlyDataArray = await getMonthlyDataArray();
      // Get yearly data
      const yearlyDataArray = await getYearlyDataArray();
    

     let topProducts=await Order.aggregate([
          { $unwind: "$items" }, // Deconstruct the items array
          { 
              $group: { 
                  _id: "$items.product", // Group by product
                  orderCount: { $sum: 1 } // Count the number of orders for each product
              } 
          },
          { 
              $sort: { orderCount: -1 } // Sort by order count descending
          },
          { 
              $limit: 10 // Limit to top 10 products
          },
          { 
              $lookup: { 
                  from: "products", // The name of the Product collection
                  localField: "_id", // Field from the current collection (Order) to match
                  foreignField: "_id", // Field from the Product collection to match
                  as: "productInfo" // Name of the field to store the joined product info
              } 
          },
          { 
              $project: { 
                  _id: 0, // Exclude the _id field
                  product: { $arrayElemAt: ["$productInfo", 0] }, // Get the first element from the productInfo array
                  orderCount: 1 // Include the orderCount field
              } 
          }
      ])

        let topCategories = await Order.aggregate([
        { $unwind: "$items" },
        {
            $lookup: {
                from: "products",
                localField: "items.product",
                foreignField: "_id",
                as: "product"
            }
        },
        { $unwind: "$product" },
        {
            $group: {
                _id: "$product.category",
                orderCount: { $sum: 1 }
            }
        },
        { $sort: { orderCount: -1 } },
        { $limit: 10 },
        {
            $lookup: {
                from: "categories",
                localField: "_id",
                foreignField: "_id",
                as: "category"
            }
        },
        { $unwind: "$category" },
        {
            $project: {
                categoryName: "$category.name",
                orderCount: 1
            }
        }
    ]);

    console.log("Top Categories:", topCategories);

    // For top brands
    let topBrands = await Order.aggregate([
        { $unwind: "$items" },
        {
            $lookup: {
                from: "products",
                localField: "items.product",
                foreignField: "_id",
                as: "product"
            }
        },
        { $unwind: "$product" },
        {
            $group: {
                _id: "$product.brand",
                orderCount: { $sum: 1 }
            }
        },
        { $sort: { orderCount: -1 } },
        { $limit: 10 }
    ]);
    
    console.log("Top Products:", topProducts);
    console.log("Top Categories:", topCategories);
    console.log("Top Brands:", topBrands);
      console.log("toppppppppppp",topProducts);

    const dailyOrderCounts= dailyDataArray.map((item) => item.count)
    const monthlyOrderCounts= monthlyDataArray.map((item) => item.count)
    const yearlyOrderCounts= yearlyDataArray.map((item) => item.count)

    res.render("admin/adminHome", {
      admin:adminData,
      totalRevenue:totalRevenueValue,
      totalOrders,
      totalCategories,
      totalProducts,
      totalUsers,
      newUsers,
      orders,
      monthlyEarningsValue,
      dailyOrderCounts,
      monthlyOrderCounts,
      yearlyOrderCounts,
      topProducts,
      topCategories,
      topBrands


    });
  } catch (error) {
    console.log(error.message);
    // Handle errors appropriately
  }
};


const loadUserpage= async(req, res)=>{
  

  try {
    const adminData = await User.findById(req.session.admin_id);

    const usersData = await User.find({
      isAdmin:0
    });

    res.render('admin/userDashboard', { users: usersData, admin: adminData });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error: " + error.message);
  }
};


const listUser = async (req, res) => {


    try {
      const {id}= req.query;
      const Uservalue = await User.findById(id);
      
      // if (Uservalue.is_blocked) {
        const UserData = await User.updateOne(
          {_id:id},
          {
            $set: {
              is_blocked:!Uservalue.is_blocked
            },
          }
        );
      //   if (req.session.user_id) delete req.session.user_id;
      // }else{
      
      //   const UserData = await User.updateOne(
      //     {_id:id},
      //     {
      //       $set: {
      //         is_blocked: 1
      //       },
      //     }
      //   );
      // }
      
      res.redirect("/admin/userData");
    } catch (error) {
      console.log(error.message);
    }
};

// admin Logout ---------------------------------
const adminLogout = async (req, res) => {
  try {

  
    delete req.session.admin_id;
 
    res.redirect("/admin");
  } catch (error) {
    console.log(error.message);
  
  }
};

module.exports = {
  loadAdminLogin,
  verifyadminLogin,
  loadHome,
  adminLogout,
  loadUserpage,
  listUser,
};
