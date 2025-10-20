const express = require('express');
const router = express.Router();
const upload = require('../config/multer-config');
const productModel = require('../models/product-model');

// Create product
router.post('/create', upload.single("image"), async function (req, res) {
    try {
        let { name, price, discount, bgcolor, panelcolor, textcolor } = req.body;

        let product = await productModel.create({
            image: req.file.buffer,
            name,
            price,
            discount,
            bgcolor,
            panelcolor,
            textcolor
        });

        req.flash("success", "Product created successfully");
        res.redirect('/owners/admin');
    }
    catch (err) {
        req.flash("error", err.message);
        res.redirect('/owners/admin');
    }
});

// Get edit page
router.get("/edit/:id", async function (req, res) {
    try {
        let product = await productModel.findById(req.params.id);
        if (!product) {
            req.flash("error", "Product not found");
            return res.redirect("/owners/admin");
        }
        res.render("edit", { product });
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/owners/admin");
    }
});

// Update product
router.post("/edit/:id", upload.single("image"), async function (req, res) {
    try {
        let { name, price, discount, bgcolor, panelcolor, textcolor } = req.body;

        let updateData = {
            name,
            price,
            discount,
            bgcolor,
            panelcolor,
            textcolor
        };

        // Only update image if new image is uploaded
        if (req.file) {
            updateData.image = req.file.buffer;
        }

        await productModel.findByIdAndUpdate(req.params.id, updateData);
        req.flash("success", "Product updated successfully");
        res.redirect("/owners/admin");
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/owners/admin");
    }
});

// Delete single product
router.get("/delete/:id", async function (req, res) {
    try {
        await productModel.findByIdAndDelete(req.params.id);
        req.flash("success", "Product deleted successfully");
        res.redirect("/owners/admin");
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/owners/admin");
    }
});

// Delete all products
router.get("/delete-all", async function (req, res) {
    try {
        await productModel.deleteMany({});
        req.flash("success", "All products deleted");
        res.redirect("/owners/admin");
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/owners/admin");
    }
});

module.exports = router;