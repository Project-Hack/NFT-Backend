const express = require("express");
const router = express.Router();
const {
  getAddresses,
  getAddressById,
  findOneFromVendorAndCreateAddress,
  getVendorInfofromAddress,
} = require("../controller/addressController");

router.get("/", getAddresses);
router.get("/:id", getAddressById);
router.get("/vendorinfo/:address", getVendorInfofromAddress);
router.post("/", findOneFromVendorAndCreateAddress);

module.exports = router;
