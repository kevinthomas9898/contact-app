const mongoose = require("mongoose");

const contactSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        require: [true],
        ref: "User",
    },
    name: {
        type: String,
        require: [true, "Please add the contact name"],
    },
    email: {
        type: String,
        require: [true, "Please add email address"],
        unique: [true, "Email address already taken"],
    },
    phone: {
        type: String,
        require: [true, "Please add phone number"],
        unique: [true, "Phone number already taken"],
    }
},
    {
        timestamps: true,
    }
)

module.exports = mongoose.model("Constact", contactSchema);