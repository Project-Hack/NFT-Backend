const Transaction = require("../models/transaction");

const getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find().populate('assetId').populate('vendorId');
        res.json(transactions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

const getTransactionById = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id).populate('assetId').populate('vendorId');
        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }
        res.json(transaction);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

const createTransaction = async (req, res) => {
    try {
        const validTypes = ['Buy', 'Resell', 'Create', 'Rent'];
        if (!validTypes.includes(req.body.transactionType)) {
            return res.status(400).json({ message: "Invalid transaction type" });
        }

        const newTransaction = new Transaction(req.body);
        await newTransaction.save();
        res.status(201).json(newTransaction);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};


module.exports = {
    getTransactions,
    getTransactionById,
    createTransaction,
};