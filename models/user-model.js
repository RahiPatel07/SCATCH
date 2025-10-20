const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    fullname: {
        type: String,
        minLength: 3,
        trim: true,
    },
    email: String,
    password: String,
    cart: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "product",
        }
    ],
    orders: [
        {
            order_id: String,
            payment_id: String,
            products: [
                {
                    _id: mongoose.Schema.Types.ObjectId,
                    name: String,
                    price: Number,
                    discount: Number,
                    image: String,
                    category: String,
                    description: String
                }
            ],
            total_amount: Number,
            date: {
                type: Date,
                default: Date.now
            }
        }
    ],
    contact: Number,
    picture: String,
});

module.exports = mongoose.model('user', userSchema);