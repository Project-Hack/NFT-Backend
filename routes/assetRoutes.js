const express = require("express");
const router = express.Router();
const {
    getAssets,
    getAssetById,
    createAsset,
    updateAsset,
    deleteAsset,
} = require("../controller/assetController");

router.get("/", getAssets);
router.get("/:id", getAssetById);
router.post("/", createAsset);
router.put("/:id", updateAsset);
router.delete("/:id", deleteAsset);

module.exports = router;