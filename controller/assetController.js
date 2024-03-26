const Asset = require("../models/asset");

const getAssets = async (req, res) => {
  try {
    const assets = await Asset.find({}).populate("owner renter");
    res.json(assets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const createAsset = async (req, res) => {
  try {
    const newAsset = new Asset(req.body);
    await newAsset.save();
    res.status(201).json({asset: newAsset, id: newAsset._id});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getAssetById = async (req, res) => {
  try {
    const asset = await Asset.findOne({id: req.params.id}).populate("owner renter");

    res.json(asset);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const updateAsset = async (req, res) => {
  try {
    const updatedAsset = await Asset.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    if (!updatedAsset) {
      return res.status(404).json({ message: "Asset not found" });
    }
    res.json(updatedAsset);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const deleteAsset = async (req, res) => {
  try {
    const deletedAsset = await Asset.findByIdAndDelete(req.params.id);
    if (!deletedAsset) {
      return res.status(404).json({ message: "Asset not found" });
    }
    res.json({ message: "Asset deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getAssets,
  getAssetById,
  createAsset,
  updateAsset,
  deleteAsset,
};