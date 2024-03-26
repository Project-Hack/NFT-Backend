const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    assetId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Asset",
        required: true
    },
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vendor",
        required: true
    },
    transactionType: {
        type: String,
        required: true,
        enum: ['Buy', 'Resell', 'Create', 'Rent']
    },
    transactionDate: {
        type: Date,
        default: Date.now
    },
});

const Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;