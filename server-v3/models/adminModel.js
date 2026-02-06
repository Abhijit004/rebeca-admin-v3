const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Missing Field: name"],
            trim: true,
        },
        image: {
            type: String,
            required: [true, "Missing Field: image"],
            trim: true
        },
        team: {
            type: String,
            trim: true,
        },
        position: {
            type: String,
            trim: true,
            required: false
        },
        email: {
            type: String,
            required: [true, "Missing Field: Email"],
            trim: true,
            unique: true
        },
        phone: {
            type: String,
        },
        dept: {
            type: String,
            trim: true,
            validate: {
                validator: (x) => x.length > 5,
                message: "ERR: dept: Department Name too short."
            }
        },
        tagLine: {
            type: String
        },
        googleId: {
            type: String,
            unique: true,
            sparse: true // Allows admins who don't have a Google ID yet to exist
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Admin", adminSchema);