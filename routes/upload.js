const express = require("express");
const uploadtos3 = require("../s3/s3_upload");
const multer = require("multer");
const Address = require("../models/address");
const Vendor = require("../models/vendor");

const router = express.Router();

const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post("/", upload.single("file"), async (req, res) => {
  const { vendorId } = req.body;
  let fileLocation;
  if (!vendorId) {
    return res.status(400).json({ message: "vendorId is required" });
  }
  try {
    let vendor = await Vendor.findById(vendorId);
    if (!vendor) {
        return sendResponseError(
        400,
        "No account found with the provided credentials. Please sign up first.",
        res
      );
    }
    fileLocation = await uploadtos3(req.file);
    await Vendor.findByIdAndUpdate(
        vendorId,
      { avatarurl: fileLocation },
    );
  } catch (error) {
    return res.status(500).send({ status: "Server Error" });
  }
  return res.status(200).json({ location: fileLocation });
});

module.exports = router;
