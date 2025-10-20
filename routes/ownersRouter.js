const express = require('express');
const router = express.Router();
const ownerModel = require('../models/owner-model');
const productModel = require('../models/product-model');

if(process.env.NODE_ENV === 'development'){
    router.post('/create', async (req, res) => {
        let owners = await ownerModel.find();
        if(owners.length > 0){
            return res
            .status(500)
            .send("you don't have permission to create a new owner");
        }

        let { fullname, email, password } = req.body;

        let createdOwner = await ownerModel.create({
            fullname,
            email,
            password,
        });
        res.status(201).send(createdOwner);   
    });
}

// All Products page
router.get("/admin", async function (req, res) {
  try {
    let products = await productModel.find();
    res.render("admin", { products });
  } catch (err) {
    res.send(err.message);
  }
});

// Create new product page
router.get("/admin/create", function (req, res) {
  let success = req.flash("success");
  res.render("createproducts", { success: success.length > 0 ? success[0] : "" });
});

module.exports = router;