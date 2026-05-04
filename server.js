require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI)
    .then(() => console.log("✅ Cloud MongoDB (Atlas) ချိတ်ဆက်မှု အောင်မြင်ပါသည်"))
    .catch(err => console.error("❌ Cloud MongoDB ချိတ်ဆက်မှု မအောင်မြင်ပါ:", err));

const RawMaterialSchema = new mongoose.Schema({
    date: String,
    viss: Number,
    cost: Number
});
const RawMaterial = mongoose.model('RawMaterial', RawMaterialSchema);

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

// 📌 ဘောက်ချာ Schema မှာ discount ထပ်တိုးထားပါတယ်
const VoucherSchema = new mongoose.Schema({
    date: String,
    name: String,
    phone: String,
    address: String,
    sold5kStr: String,
    sold10kStr: String,
    bagFee: Number,
    discount: Number,   // 📌 အသစ် (လျှော့ငွေ)
    totalCost: Number,
    paidAmount: Number,
    debt: Number
});
const Voucher = mongoose.model('Voucher', VoucherSchema);

app.get('/', (req, res) => { res.send("Win Win Tea Server Version 2.1 is running!"); });

app.get('/api/data', async (req, res) => {
    try {
        const rawMaterials = await RawMaterial.find();
        const prodLogs = await ProdLog.find();
        const vouchers = await Voucher.find();
        res.json({ rawMaterials, prodLogs, vouchers });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/raw', async (req, res) => {
    try {
        const newRaw = new RawMaterial(req.body);
        await newRaw.save();
        res.status(201).json({ data: newRaw });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/production', async (req, res) => {
    try {
        const newLog = new ProdLog(req.body);
        await newLog.save();
        res.status(201).json({ data: newLog });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/voucher', async (req, res) => {
    try {
        const newVoucher = new Voucher(req.body);
        await newVoucher.save();
        res.status(201).json({ data: newVoucher });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

app.put('/api/voucher/:id/pay', async (req, res) => {
    try {
        const voucherId = req.params.id;
        const { payAmount } = req.body; 
        const voucher = await Voucher.findById(voucherId);
        if (!voucher) return res.status(404).json({ message: "Not found" });

        voucher.paidAmount += Number(payAmount);
        voucher.debt = voucher.totalCost - voucher.paidAmount;
        if (voucher.debt < 0) voucher.debt = 0;

        await voucher.save();
        res.json({ data: voucher });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => { console.log(`🚀 Server is running on port ${PORT}`); });