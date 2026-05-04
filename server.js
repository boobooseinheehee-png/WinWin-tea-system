require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Cloud MongoDB (Atlas) ချိတ်ဆက်ခြင်း
const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI)
    .then(() => console.log("✅ Cloud MongoDB (Atlas) ချိတ်ဆက်မှု အောင်မြင်ပါသည်"))
    .catch(err => console.error("❌ Cloud MongoDB ချိတ်ဆက်မှု မအောင်မြင်ပါ:", err));

const ProdLogSchema = new mongoose.Schema({
    date: String,
    prod5kStr: String,
    prod10kStr: String,
    laborCost: Number,
    materialsCost: Number,
    deliFee: Number,
    totalExp: Number
});
const ProdLog = mongoose.model('ProdLog', ProdLogSchema);

const VoucherSchema = new mongoose.Schema({
    date: String,
    name: String,
    phone: String,
    address: String,
    sold5kStr: String,
    sold10kStr: String,
    bagFee: Number,
    totalCost: Number,
    paidAmount: Number,
    debt: Number
});
const Voucher = mongoose.model('Voucher', VoucherSchema);

app.get('/', (req, res) => {
    res.send("Win Win Tea Server Version 2.0 is running!");
});

app.get('/api/data', async (req, res) => {
    try {
        const prodLogs = await ProdLog.find();
        const vouchers = await Voucher.find();
        res.json({ prodLogs, vouchers });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/production', async (req, res) => {
    try {
        const newLog = new ProdLog(req.body);
        await newLog.save();
        res.status(201).json({ message: "ထုတ်လုပ်မှု မှတ်တမ်း သိမ်းဆည်းပြီးပါပြီ", data: newLog });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/voucher', async (req, res) => {
    try {
        const newVoucher = new Voucher(req.body);
        await newVoucher.save();
        res.status(201).json({ message: "ဘောက်ချာ သိမ်းဆည်းပြီးပါပြီ", data: newVoucher });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 📌 အကြွေးဆပ်ရန် လမ်းကြောင်း 
app.put('/api/voucher/:id/pay', async (req, res) => {
    try {
        const voucherId = req.params.id;
        const { payAmount } = req.body; 

        const voucher = await Voucher.findById(voucherId);
        if (!voucher) return res.status(404).json({ message: "ဘောက်ချာ ရှာမတွေ့ပါ" });

        voucher.paidAmount += Number(payAmount);
        voucher.debt = voucher.totalCost - voucher.paidAmount;
        if (voucher.debt < 0) voucher.debt = 0;

        await voucher.save();
        res.json({ message: "အကြွေးဆပ်ခြင်း အောင်မြင်ပါသည်", data: voucher });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});