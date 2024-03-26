require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const fs = require("fs");
const FormData = require("form-data");

const vendorRoutes = require("./routes/vendorRoutes");
const addressRoutes = require("./routes/addressRoutes");
const assetRoutes = require("./routes/assetRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const uploadRoute = require("./routes/upload");
const { verifyUser } = require("./middleware/middleware");

const { connectDB } = require("./config/db");

connectDB();
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.get("/api", (req, res) => {
  res.json({
    message: "API running...",
  });
});

app.use("/api/vendor", vendorRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/assets", assetRoutes);
app.use("/api/transaction", transactionRoutes);
app.use("/api/upload", uploadRoute);

app.get("/api/games", async (req, res) => {
  try {
    const game = fs.readFileSync("game.json");
    const gameData = JSON.parse(game);
    res.json(gameData);
  } catch (error) {
    console.error("Error in fetch-assets:", error.message);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
});

app.post("/api/mint-asset", async (req, res) => {
  try {
    let data = req.body;
    let formData = new FormData();

    const buffer = Buffer.from(JSON.stringify(data));
    formData.append("file", buffer, { filename: `${data.id}.json` });

    const ipfsResult = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        headers: {
          Authorization: `Bearer ${process.env.JWT}`,
        },
      }
    );
    console.log(ipfsResult.data);
    return res.json({
      ipfsResult: ipfsResult.data,
    });
  } catch (error) {
    console.error("Error in pining to IPFS:", error.message);
  }
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
