require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI).then(() => console.log("✅ Cloud Connected")).catch(err => console.error(err));

// ကုန်ကြမ်း
const RawMaterial = mongoose.model('RawMaterial', new mongoose.Schema({ date: String, viss: Number, cost: Number }));
// ထုတ်လုပ်မှု
const ProdLog = mongoose.model('ProdLog', new mongoose.Schema({ date: String, prod5kStr: String, prod10kStr: String, laborCost: Number, materialsCost: Number, deliFee: Number, totalExp: Number }));
// အရောင်း
const Voucher = mongoose.model('Voucher', new mongoose.Schema({ date: String, name: String, phone: String, address: String, sold5kStr: String, sold10kStr: String, bagFee: Number, discount: Number, totalCost: Number, paidAmount: Number, debt: Number }));

app.get('/api/data', async (req, res) => {
    try {
        const rawMaterials = await RawMaterial.find();
        const prodLogs = await ProdLog.find();
        const vouchers = await Voucher.find();
        res.json({ rawMaterials, prodLogs, vouchers });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/raw', async (req, res) => { const n = new RawMaterial(req.body); await n.save(); res.status(201).json(n); });
app.post('/api/production', async (req, res) => { const n = new ProdLog(req.body); await n.save(); res.status(201).json(n); });
app.post('/api/voucher', async (req, res) => { const n = new Voucher(req.body); await n.save(); res.status(201).json(n); });
app.put('/api/voucher/:id/pay', async (req, res) => {
    const v = await Voucher.findById(req.params.id);
    v.paidAmount += Number(req.body.payAmount);
    v.debt = Math.max(0, v.totalCost - v.paidAmount);
    await v.save(); res.json(v);
});

app.get('/', (req, res) => res.send("Win Win Tea Server 2.5 Active"));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Port ${PORT}`));