const Product = require("../../model/productModel");
const path=require('path')
const Category = require("../../model/categoryModel");
const User=require("../../model/userModel")
const sharp=require('sharp')

// ------------Get product page--------------
const loadProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 6;
    const totalCount = await Product.countDocuments();
    const totalPages = Math.ceil(totalCount / limit);

    const products = await Product.find()
      .populate("category")
      .skip((page - 1) * limit)
      .limit(limit);

    const categories = await Category.find();

    res.render("admin/products", {
      products,
      categories,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.log(error.message);
  }
};


// -------------Get add Porduct Page-----------------------
const loadPorductForm = async (req, res) => {
  try {
    const userData = await User.findById({ _id: req.session.admin_id });
    let categories = await Category.find({});
    console.log( categories);
    res.render("admin/addProduct", { categories, admin: userData, });
  } catch (error) {
    console.log(error.message);
  }
};


// ------------add Product------------------
const addProduct = async (req, res) => {
  try {
    const imageData = [];
    const imageFiles = req.files;

    for (const file of imageFiles) {
      const randomInteger = Math.floor(Math.random() * 20000001);
      const imageDirectory = path.join('public', 'assets', 'imgs', 'productIMG');
      const imgFileName = "cropped" + randomInteger + ".jpg";
      const imagePath = path.join(imageDirectory, imgFileName);
      const croppedImage = await sharp(file.path)
        // .resize(580, 320, {
          .resize(440, 337, {
          fit: "cover",
        })
        .toFile(imagePath);

      if (croppedImage) {
        imageData.push(imgFileName);
      }
    }

    const { name, brand, category, stock, price,discount_price, description,image } = req.body;
    const existingProduct = await Product.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });
    let categories = await Category.find({});
    if (existingProduct) {
      res.render("admin/addProduct", {
        error: "Product with the same name already exists",
        product: existingProduct,
        categories,
      });
    }
    const addProducts = new Product({
      name,
      brand,
      category,
      stock,
      price,
      discount_price, 
      description,
      image: imageData,
    });

    await addProducts.save();
    res.redirect("/admin/products");
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Error while adding product");
  }
};



//--------------TO get edit product page-----------------
const loadEditPorductForm = async (req, res) => {
  try {
    const id = req.query.id;
    const product = await Product.findOne({ _id: id });
    let categories = await Category.find({});
    if (product) {
      res.render("admin/editProduct", { categories,product});
    } else {
      res.redirect("/admin/products");
    }
  } catch (error) {
    console.log(error.message);
  }
};

// ---------store Edit Product--------------------

const storeEditProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.body.product_id });
    let images = [];
    let deleteData = []; // Declare deleteData here
    const {
      name,
      brand,
      category,
      stock,
      price,
      discount_price,
      description,
      image: imageData,
    } = req.body;

    const existingProduct = await Product.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });
    let categories = await Category.find({});

    if (req.body.deletecheckbox) {
      // Initialize deleteData as an array
      // deleteData = Array.isArray(req.body.deletecheckbox)
      //   ? req.body.deletecheckbox.map((x) => Number(x))
      //   : [Number(req.body.deletecheckbox)];

      
          deleteData.push(req.body.deletecheckbox);
          deleteData = deleteData.flat().map((x) => Number(x));

          
      images = product.image.filter((img, idx) => !deleteData.includes(idx));
    } else {
      images = product.image.map((img) => img);
    }

    if (req.files.length !== 0) {
      for (const file of req.files) {
        console.log(file, "File received");

        const randomInteger = Math.floor(Math.random() * 20000001);
        const imageDirectory = path.join('public', 'assets', 'imgs', 'productIMG');
        const imgFileName = "cropped" + randomInteger + ".jpg";
        const imagePath = path.join(imageDirectory, imgFileName);

        console.log(imagePath, "Image path");

        const croppedImage = await sharp(file.path)
          // .resize(580, 320, {
          //   fit: "cover",
          .resize(440, 337, {
            fit: "fill",
          })
          .toFile(imagePath);

        if (croppedImage) {
          images.push(imgFileName);
        }
      }
    }

    await Product.findByIdAndUpdate(
      { _id: req.body.product_id },
      {
        $set: {
          name: name,
          brand: brand,
          category: category,
          stock: stock,
          price: price,
          discount_price: discount_price,
          description: description,
          image: images, // Use the updated images array here
        },
      }
    );
    res.redirect("/admin/products");
  } catch (error) {
    console.log(error.message);
  }
};



// ------------deleteProduct--------------
const deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id, "kkkkkk");
    const productData = await Product.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          is_listed: false,
        },
      }
    );
    res.redirect("/admin/products");
  } catch (error) {
    console.log(error.message);
  }
};



// product visible for admin not for user---------------

const productVisible = async (req, res) => {
  try {
    const productId = req.params.id;

    // Validate if productId is a valid MongoDB ObjectId
    // if (!mongoose.Types.ObjectId.isValid(productId)) {
    //   return res.status(400).send("Invalid product ID");
    // }

    const product = await Product.findById(productId);
if(product.isVisible){
  await Product.updateOne({_id:productId},{ $set: { isVisible: false } })
}else{
  await Product.updateOne({_id:productId},{ $set: { isVisible: true } })
}
    // Check if the product is found and updated successfully
    if (!product) {
      return res.status(404).send("Product not found");
    }
console.log('listing');
    res.redirect("/admin/products");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Error while updating product visibility");
  }
};

module.exports = {
  loadProducts,
  loadPorductForm,
  addProduct,
  deleteProduct,
  loadEditPorductForm,
  storeEditProduct,
  productVisible,
};
