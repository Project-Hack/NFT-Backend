const express = require("express");
const router = express.Router();
const {
    getTransactions,
    getTransactionById,
    createTransaction,
} = require("../controller/transactionController");

router.get("/", getTransactions);
router.get("/:id", getTransactionById);
router.post("/", createTransaction);

module.exports = router;