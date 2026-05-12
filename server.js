require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI).then(() => console.log("✅ Cloud Connected")).catch(err => console.error(err));

const RawMaterial = mongoose.model('RawMaterial', new mongoose.Schema({ date: String, viss: Number, cost: Number }));
const ProdLog = mongoose.model('ProdLog', new mongoose.Schema({ date: String, prod5kStr: String, prod10kStr: String, laborCost: Number, materialsCost: Number, deliFee: Number, totalExp: Number }));
const Voucher = mongoose.model('Voucher', new mongoose.Schema({ date: String, name: String, phone: String, address: String, sold5kStr: String, sold10kStr: String, bagFee: Number, discount: Number, totalCost: Number, paidAmount: Number, debt: Number }));

// ဒေတာများ ဆွဲယူရန်
app.get('/api/data', async (req, res) => {
    try {
        const rawMaterials = await RawMaterial.find();
        const prodLogs = await ProdLog.find();
        const vouchers = await Voucher.find();
        res.json({ rawMaterials, prodLogs, vouchers });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

// အသစ်သွင်းရန် (POST)
app.post('/api/raw', async (req, res) => { const n = new RawMaterial(req.body); await n.save(); res.status(201).json(n); });
app.post('/api/production', async (req, res) => { const n = new ProdLog(req.body); await n.save(); res.status(201).json(n); });
app.post('/api/voucher', async (req, res) => { const n = new Voucher(req.body); await n.save(); res.status(201).json(n); });

// အကြွေးဆပ်ရန် (PUT)
app.put('/api/voucher/:id/pay', async (req, res) => {
    try {
        const v = await Voucher.findById(req.params.id);
        v.paidAmount += Number(req.body.payAmount);
        v.debt = Math.max(0, v.totalCost - v.paidAmount);
        await v.save(); res.json(v);
    } catch (error) { res.status(500).json({ error: error.message }); }
});

// 📌 ဖျက်ရန် (DELETE) - အသစ်ထည့်ထားသောအပိုင်း
app.delete('/api/raw/:id', async (req, res) => { await RawMaterial.findByIdAndDelete(req.params.id); res.json({ success: true }); });
app.delete('/api/production/:id', async (req, res) => { await ProdLog.findByIdAndDelete(req.params.id); res.json({ success: true }); });
app.delete('/api/voucher/:id', async (req, res) => { await Voucher.findByIdAndDelete(req.params.id); res.json({ success: true }); });

app.get('/', (req, res) => res.send("Win Win Tea Server is running (with Delete feature)"));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Port ${PORT}`));