const mongoose = require("mongoose");

const assetSchema = mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true
    },
    uri: {
      type: String,
      required: true,
      unique: true
    },
    rented: {
      type: Boolean,
      default: false
    },
    rentStart: {
      type: Date,
      default: null
    },
    rentEnd: {
      type: Date,
      default: null
    },
    sold: {
      type: Boolean,
      default: false
    },
    isForSale: {
      type: Boolean,
      default: false
    },
    isForRent: {
      type: Boolean,
      default: false
    },
    isWETH: {
      type: Boolean,
      default: false
    },
    price: {
      type: Number,
      default: null
    },
    rentPrice: {
      type: Number,
      default: null
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },
    renter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      default: null
    }
  },
  { timestamps: true }
);

const Asset = mongoose.model("Asset", assetSchema);

module.exports = Asset;
