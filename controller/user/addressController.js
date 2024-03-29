const User = require("../../model/userModel");
const Address = require("../../model/addressModel");



// Get Address Page --------------------
const loadAddress = async (req, res) => {
    try {
        const userId =  req.session.user_id;

        const userData = await User.findById(userId);

        if (userData) {
            const addressData = await Address.find({user:userId});
            res.render("user/userAddress",{ userData,addressData });
          } else {
            res.redirect('/login');
          }
    
    } catch (error) {
      console.log(error.message);
    }
  };

// Get addAddress Page---------------------
  const loadAddAddress = async (req, res) => {
    try {
        const userId =  req.session.user_id;
      
        const userData = await User.findById(userId);
        if (userData) {
            res.render("user/addAddress", { userData, });
          } else {
            res.redirect('/login');
          }
    
   
    } catch (error) {
      console.log(error.message);
    }
  };
  

  

    
// Post Addaddress-------------------------

  const addAddress = async (req, res) => {
    try {
     
        const userId =  req.session.user_id;
  
      const { houseName,street,city,state,pincode  } = req.body;
 

     
  
      const address = new Address({
        user: userId,
        houseName,
        street,
        city,
        state,
        pincode,
        is_listed:true
       
    });
    const addressData = await address.save();

   
    res.redirect("/userAddress");
  
    } catch (error) {
      console.log(error.message);
    }
  };

//   Get Edit Address Page------------------------------
  const loadEditAddress = async (req, res) => {
    try {
        const userId =  req.session.user_id;
      
        const userData = await User.findById(userId);
      const id = req.query.id;
      const address = await Address.findById(id);
  
      res.render("user/editAddress", {  userData, Address: address });
    } catch (error) {
      console.log(error.message); 
    }
  };


//   Post Edit Address Page---------------------------
  const editAddress = async (req, res) => {
    try {
      const {address_id} = req.body;

      const { houseName,street,city,state,pincode  } = req.body;
      const updateData = await Address.findByIdAndUpdate(
        { _id: address_id },
        {
          $set: {
            houseName,
            street,
            city,
            state,
            pincode,
            is_listed:true
          },
        }
      );
      res.redirect("/userAddress");
    }
    catch (error) {
        console.log(error.message);
      }  
  
      
    } 


 // Delete Address Page------------------------------ 
const deleteAddress = async (req, res) => {
  try {
    const {id} = req.query;
    console.log(id, "kkkkkk");
    const addressData = await Address.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          is_listed: false,
        },
      }
    );
    res.redirect("/userAddress");
  } catch (error) {
    console.log(error.message);
  }
};

  
  



  module.exports = {
    loadAddress,
    loadAddAddress,
    addAddress,
    loadEditAddress,
    editAddress,
    deleteAddress
    
  };