require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Cloud MongoDB (Atlas) ချိတ်ဆက်ခြင်း - VPN/SRV Bypass
const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI)
    .then(() => console.log("✅ Cloud MongoDB (Atlas) ချိတ်ဆက်မှု အောင်မြင်ပါသည်"))
    .catch(err => console.error("❌ Cloud MongoDB ချိတ်ဆက်မှု မအောင်မြင်ပါ:", err));

// 1. ထုတ်လုပ်မှုနှင့် စရိတ် မှတ်တမ်း Schema
const ProdLogSchema = new mongoose.Schema({
    date: String,
    prod5kStr: String,
    prod10kStr: String,
    laborCost: Number,
    materialsCost: Number,
    totalExp: Number
});
const ProdLog = mongoose.model('ProdLog', ProdLogSchema);

// 2. အရောင်းဘောက်ချာ Schema
const VoucherSchema = new mongoose.Schema({
    date: String,
    name: String,
    sold5kStr: String,
    sold10kStr: String,
    totalCost: Number,
    paidAmount: Number,
    debt: Number
});
const Voucher = mongoose.model('Voucher', VoucherSchema);

// --- API Endpoints ---
app.get('/', (req, res) => {
    res.send("Bhin Hub Tea Server is running!");
});

// မှတ်တမ်းများအားလုံးကို ဆွဲထုတ်ရန် (GET)
app.get('/api/data', async (req, res) => {
    try {
        const prodLogs = await ProdLog.find();
        const vouchers = await Voucher.find();
        res.json({ prodLogs, vouchers });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// ထုတ်လုပ်မှု မှတ်တမ်းသစ် ထည့်ရန် (POST)
app.post('/api/production', async (req, res) => {
    try {
        const newLog = new ProdLog(req.body);
        await newLog.save();
        res.status(201).json({ message: "ထုတ်လုပ်မှု မှတ်တမ်း သိမ်းဆည်းပြီးပါပြီ", data: newLog });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ဘောက်ချာ အသစ်ထည့်ရန် (POST)
app.post('/api/voucher', async (req, res) => {
    try {
        const newVoucher = new Voucher(req.body);
        await newVoucher.save();
        res.status(201).json({ message: "ဘောက်ချာ သိမ်းဆည်းပြီးပါပြီ", data: newVoucher });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});