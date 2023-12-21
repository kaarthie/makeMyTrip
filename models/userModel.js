const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email : {
        type : String,
        required : false,
        unique: true,
    },
    phone : {
        type : String,
        required : false,
        unique: true,
    },
    password : {
        type : String,
        required : false
    },
    name: {
        type: String,
        required: false,
        trim: true,
    },
    birthday: {
        type: Date,
        required: false,
        validate: {
            validator: (value) => {
                // Validate that the birthday is not in the future
                return !value || value <= new Date();
            },
            message: 'Birthday cannot be in the future',
        },
    },
    gender: {
        type: String,
        enum: ['Male', 'Female'],
        required: false,
    },
    maritalStatus: {
        type: String,
        enum: ['Single', 'Married', 'Divorced', 'Widowed', 'Other'],
        required: false,
    },
    address: {
        type: String,
        required: false,
        trim: true,
    },
    pincode: {
        type: String,
        required: false,
        validate: {
            validator: (value) => {
                return !value || /^\d{6}$/.test(value) && !isNaN(Number(value));
            },
            message: 'Pincode must be a numeric 6-digit number',
        },
    },
    state: {
        type: String,
        required: false,
        trim: true,
    },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
