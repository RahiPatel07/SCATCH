const express = require('express');
const router = express.Router();
const productModel = require('../models/product-model');
const isLoggedIn = require('../middlewares/isLoggedIn');
const userModel = require('../models/user-model');

router.get("/", function (req, res) {
  let error = req.flash("error");
  res.render("index", { error: error.length > 0 ? error[0] : "", loggedin: false });
});

router.get("/shop", isLoggedIn, async function (req, res) {
  try {
    let products = await productModel.find();
    let success = req.flash("success");
    res.render("shop", { 
      products,
      success: success.length > 0 ? success[0] : ""
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
    user.cart.push(req.params.id); // Changed from req.params.productid to req.params.id
    await user.save();
    req.flash("success", "Product added to cart");
    res.redirect("/shop");
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/shop");
  }
});

module.exports = router;