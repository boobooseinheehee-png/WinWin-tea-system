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

// 1. ထုတ်လုပ်မှုနှင့် စရိတ် မှတ်တမ်း Schema (ကုန်ကျစရိတ်ဘက် - ကားခ/Deli ခ ဒီမှာပါမည်)
const ProdLogSchema = new mongoose.Schema({
    date: String,
    prod5kStr: String,
    prod10kStr: String,
    laborCost: Number,
    materialsCost: Number,
    deliFee: Number,    // အိတ်လာတင်ပေးသော အလုပ်သမားခ/ကားခ (အသစ်)
    totalExp: Number
});
const ProdLog = mongoose.model('ProdLog', ProdLogSchema);

// 2. အရောင်းဘောက်ချာ Schema (အရောင်းဘက် - ဖုန်း၊ လိပ်စာ၊ အိတ်ဖိုး ဒီမှာပါမည်)
const VoucherSchema = new mongoose.Schema({
    date: String,
    name: String,
    phone: String,     // ဖုန်းနံပါတ် (အသစ်)
    address: String,   // လိပ်စာ/ရွာ (အသစ်)
    sold5kStr: String,
    sold10kStr: String,
    bagFee: Number,    // ဝယ်သူထံမှ ကောက်ခံသော အိတ်ဖိုး (အသစ်)
    totalCost: Number,
    paidAmount: Number,
    debt: Number
});
const Voucher = mongoose.model('Voucher', VoucherSchema);

// --- API Endpoints ---
app.get('/', (req, res) => {
    res.send("Win Win Tea Server Version 2.0 is running!");
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

// 📌 အကြွေးဆပ်ရန် လမ်းကြောင်း (API Endpoint အသစ်)
app.put('/api/voucher/:id/pay', async (req, res) => {
    try {
        const voucherId = req.params.id;
        const { payAmount } = req.body; 

        const voucher = await Voucher.findById(voucherId);
        if (!voucher) return res.status(404).json({ message: "ဘောက်ချာ ရှာမတွေ့ပါ" });

        // ပေးပြီးသားငွေကို ပေါင်းထည့်မယ်၊ အကြွေးကို ပြန်နုတ်မယ်
        voucher.paidAmount += Number(payAmount);
        voucher.debt = voucher.totalCost - voucher.paidAmount;
        
        // အကြွေးကျေသွားရင် (အနှုတ်ပြနေရင်) သုည ပဲထားမယ်
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
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});