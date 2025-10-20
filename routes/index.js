const express = require('express');
const router = express.Router();
const productModel = require('../models/product-model');
const isLoggedIn = require('../middlewares/isLoggedIn');
const userModel = require('../models/user-model');
const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

router.get("/", function (req, res) {
  // If user is already logged in, redirect to shop
  if (req.cookies.token) {
    return res.redirect("/shop");
  }
  
  let error = req.flash("error");
  res.render("index", { error: error.length > 0 ? error[0] : "", loggedin: false });
});

router.get("/shop", isLoggedIn, async function (req, res) {
  try {
    let filter = req.query.filter || 'all';
    let sortby = req.query.sortby || 'popular';
    let products;
    
    if (filter === 'new') {
      // Get the 10 most recently added products
      products = await productModel.find().sort({ _id: -1 }).limit(10);
    } else if (filter === 'discount') {
      // Get products with discount greater than 0
      products = await productModel.find({ discount: { $gt: 0 } });
    } else {
      // Get all products (default)
      products = await productModel.find();
    }
    
    // Apply sorting
    if (sortby === 'newest') {
      products = products.sort((a, b) => b._id.getTimestamp() - a._id.getTimestamp());
    } else if (sortby === 'popular') {
      // For popular, you can sort by any field (e.g., price descending as placeholder)
      // You can later add a 'popularity' field or 'soldCount' field to your product model
      products = products.sort((a, b) => b.price - a.price);
    }
    
    let success = req.flash("success");
    res.render("shop", { 
      products,
      success: success.length > 0 ? success[0] : "",
      filter: filter,
      sortby: sortby
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/");
  }
});

router.get("/cart", isLoggedIn, async function (req, res) {
  let user = await userModel.findOne({ email: req.user.email }).populate('cart');
  res.render("cart", { user });
});

router.get("/addtocart/:id", isLoggedIn, async function (req, res) {
  try {
    let user = await userModel.findOne({ email: req.user.email });
    user.cart.push(req.params.id);
    await user.save();
    req.flash("success", "Product added to cart");
    res.redirect("/shop");
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/shop");
  }
});

router.get("/removefromcart/:id", isLoggedIn, async function (req, res) {
  try {
    let user = await userModel.findOne({ email: req.user.email });
    user.cart = user.cart.filter(cartItemId => cartItemId.toString() !== req.params.id);
    await user.save();
    res.redirect("/cart");
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/cart");
  }
});

router.get("/profile", isLoggedIn, async function (req, res) {
  try {
    let user = await userModel.findOne({ email: req.user.email }).populate('cart');
    res.render("profile", { user });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/");
  }
});

// Create order for payment
router.post("/create-order", isLoggedIn, async function (req, res) {
  try {
    let user = await userModel.findOne({ email: req.user.email }).populate('cart');
    
    if (user.cart.length === 0) {
      req.flash("error", "Your cart is empty");
      return res.redirect("/cart");
    }

    // Calculate total amount
    let totalPrice = 0;
    let totalDiscount = 0;
    
    user.cart.forEach(item => {
      totalPrice += item.price;
      totalDiscount += item.discount;
    });
    
    let platformFee = user.cart.length * 20;
    let finalAmount = (totalPrice + platformFee) - totalDiscount;

    // Create Razorpay order
    const options = {
      amount: finalAmount * 100, // amount in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        user_email: user.email,
        user_name: user.fullname
      }
    };

    const order = await razorpay.orders.create(options);
    
    res.json({
      success: true,
      order_id: order.id,
      amount: finalAmount,
      key_id: process.env.RAZORPAY_KEY_ID,
      user: {
        name: user.fullname,
        email: user.email,
        contact: user.contact || ""
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Verify payment
router.post("/verify-payment", isLoggedIn, async function (req, res) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      let user = await userModel.findOne({ email: req.user.email }).populate('cart');
      
      console.log("User cart before processing:", user.cart);
      console.log("Cart length:", user.cart.length);
      
      // Convert product images from Buffer to base64 string
      const productDetails = user.cart.map(item => {
        console.log("Processing item:", {
          name: item.name,
          price: item.price,
          discount: item.discount,
          hasImage: !!item.image
        });

        return {
          _id: item._id,
          name: item.name || "Unnamed Product",
          price: item.price || 0,
          discount: item.discount || 0,
          image: item.image ? item.image.toString('base64') : null,
          bgcolor: item.bgcolor || "",
          panelcolor: item.panelcolor || "",
          textcolor: item.textcolor || ""
        };
      });

      // console.log("Product details before saving:", productDetails);

      const order = {
        order_id: razorpay_order_id,
        payment_id: razorpay_payment_id,
        products: productDetails,
        total_amount: req.body.amount,
        date: new Date()
      };
      
      // console.log("Order object:", order);

      user.orders.push(order);
      await user.save();
      
      // console.log("Order saved successfully");
      // console.log("User orders after save:", user.orders);

      user.cart = [];
      await user.save();
      
      req.flash("success", "Payment successful! Order placed.");
      res.json({ success: true, redirect: "/orders" });
    } else {
      req.flash("error", "Payment verification failed");
      res.json({ success: false, message: "Invalid signature" });
    }
  } catch (err) {
    console.error("Error in verify-payment:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Orders page
router.get("/orders", isLoggedIn, async function (req, res) {
  try {
    let user = await userModel.findOne({ email: req.user.email });
    let success = req.flash("success");
    res.render("orders", { 
      user,
      success: success.length > 0 ? success[0] : ""
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/");
  }
});

module.exports = router;