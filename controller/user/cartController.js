const Cart =require('../../model/cartModel');
const User = require('../../model/userModel');
const {calculateProductTotal,calculateSubtotal}=require('../../config/cartSum')


// ----------load Cat Page-----------------
const loadCartPage = async (req, res) => {
    try {
        const userId = req.session.user_id;
       console.log('userId:',userId);
        
        const userData = await User.findById(userId);
        
        if (userData) {

            const userCart = await Cart.findOne({ user: userId }).populate("items.product");
            let subtotalWithShipping=0
            if (userCart) {
                const cart = userCart ? userCart.items : [];
                const subtotal = calculateSubtotal(cart);
          
                const productTotal = calculateProductTotal(cart);
                const subtotalWithShipping = subtotal;
                console.log(productTotal,"sub12");
               
                let outOfStockError = false;
            
                if (cart.length > 0) {
                  for (const cartItem of cart) {
                    const product = cartItem.product;
            
                    if (product.quantity < cartItem.quantity) {
                      outOfStockError = true;
                      break;
                    }
                  }
                }
                let maxQuantityErr = false;
                if (cart.length > 0) {
                  for (const cartItem of cart) {
                    const product = cartItem.product;
            
                    if (cartItem.quantity > 2) {
                      maxQuantityErr = true;
                      break;
                    }
                  }
                }
                console.log(cart, "Sudha");
                res.render("user/cart", { userData,
                  productTotal,
        subtotalWithShipping,
        outOfStockError,
        maxQuantityErr,
        cart });
            } else {
                // Handle scenario where user has no cart
                res.render("user/cart", { userData, cart: [],subtotalWithShipping });
            }
        } else {
            res.redirect('/login');
        }
    } catch (error) {
        console.error("Error loading cart:", error);
        res.status(500).send("Error loading cart");
    }
  }

// -------Add  to Cart ----------------------------
  const addTocart = async (req, res) => {
    try {
      const userId = req.session.user_id;
      const product_Id = req.body.productData_id;
      let qty = parseInt(req.body.qty, 10);
       qty = qty? qty:1
      console.log('userId:',userId);
      console.log('product_Id:', product_Id);
      console.log('qty:', qty);

  
      if (!userId || !product_Id || isNaN(qty) || qty <= 0) {
        // Handle missing or invalid parameters
        return res.status(400).json({ success: false, error: 'Invalid parameters' });
      }
  
      const existingCart = await Cart.findOne({ user: userId });
  
      if (existingCart) {
        const existingCartItem = existingCart.items.find(
          (item) => item.product.toString() === product_Id
        );
  
        if (existingCartItem) {
          existingCartItem.quantity += qty;
        } else {
          console.log('else');
          existingCart.items.push({
            product: product_Id,
            quantity: qty,
          });
        }
  
        existingCart.total = existingCart.items.reduce(
          (total, item) => total + (item.quantity || 0),
          0
        );
  console.log('save');
        await existingCart.save();
      } else {
        const newCart = new Cart({
          user: userId,
          items: [{ product: product_Id, quantity: qty }],
          total: qty,
        });
  
        await newCart.save();
      }
  
      res.redirect('/cart');
    } catch (error) {
      console.error("Error adding product to cart:", error);
  
      // Handle specific database validation errors
      if (error.name === 'ValidationError') {
        return res.status(400).json({ success: false, error: error.message });
      }
  
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  };
  
//  --------------update Cart Count-----------------------------
  const updateCartCount = async (req, res) => {
    try {
      const userId = req.session.user_id;
      const productId = req.query.productId;
      const newQuantity = parseInt(req.body.newQuantity);
      const existingCart = await Cart.findOne({ user: userId }).populate("items.product");
      if (existingCart) {
        const existingCartItem = existingCart.items.find(
          (item) => item.product._id.toString() == productId
        );
  
        if (existingCartItem) {
          existingCartItem.quantity = newQuantity;
          existingCart.total = existingCart.items.reduce(
            (total, item) => total + (item.quantity || 0),
            0
          );
  
          
        }
        await existingCart.save();
        res.json({ success: true });
      } else {
        res.json({ success: false, error: "Cart not found" });
      }
    } catch (error) {
      console.error("Error updating cart:", error);
      res.json({ success: false, error: "Internal server error" });
    }
  };

  //------ remove From Cart-------------------------
  const removeFromCart = async (req, res) => {
    try {
      const userId = req.session.user_id;
      const productId = req.query.productId;
  
      const existingCart = await Cart.findOne({ user: userId });
      if (existingCart) {
        const updatedItems = existingCart.items.filter(
          (item) => item.product.toString() !== productId
        );
  
        existingCart.items = updatedItems;
        existingCart.total = updatedItems.reduce(
          (total, item) => total + (item.quantity || 0),
          0
        );
  
        await existingCart.save();
  
        res.json({ success: true ,toaster:true});
      } else {
        res.json({ success: false, error: "Cart not found" });
      }
    } catch (error) {
      console.error("Error removing cart item:", error);
      res.json({ success: false, error: "Internal server error" });
    }
  };
  




  

module.exports={
    loadCartPage,
    addTocart,
    updateCartCount,
    removeFromCart
}