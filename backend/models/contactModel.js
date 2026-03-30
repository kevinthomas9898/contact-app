const mongoose = require("mongoose");

const contactSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true],
        ref: "User",
    },
    name: {
        type: String,
        required: [true, "Please add the contact name"],
    },
    email: {
        type: String,
        required: [true, "Please add email address"],
        unique: [true, "Email address already taken"],
    },
    phone: {
        type: String,
        required: [true, "Please add phone number"],
        unique: [true, "Phone number already taken"],
    }
},
    {
        timestamps: true,
    }
)

module.exports = mongoose.model("Contact", contactSchema);