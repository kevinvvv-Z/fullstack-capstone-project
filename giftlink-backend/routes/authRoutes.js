const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const connectToDatabase = require('../models/db');

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key';

router.post('/register', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('users');
        const existingUser = await collection.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }
        const salt = await bcryptjs.genSalt(10);
        const hash = await bcryptjs.hash(req.body.password, salt);
        const newUser = await collection.insertOne({
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: hash,
            createdAt: new Date(),
        });
        const payload = { user: { id: newUser.insertedId } };
        const authtoken = jwt.sign(payload, JWT_SECRET);
        res.json({ authtoken, email: req.body.email });
    } catch (e) {
        res.status(500).send('Internal Server Error');
    }
});

router.post('/login', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('users');
        const theUser = await collection.findOne({ email: req.body.email });
        if (!theUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        const compare = await bcryptjs.compare(req.body.password, theUser.password);
        if (!compare) {
            return res.status(400).json({ error: 'Invalid password' });
        }
        const payload = { user: { id: theUser._id } };
        const authtoken = jwt.sign(payload, JWT_SECRET);
        res.json({ authtoken, userName: theUser.firstName, userEmail: theUser.email });
    } catch (e) {
        res.status(500).send('Internal Server Error');
    }
});

router.put('/update', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('users');
        const email = req.headers.email;
        const existingUser = await collection.findOne({ email: email });
        if (!existingUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        existingUser.firstName = req.body.name || existingUser.firstName;
        existingUser.updatedAt = new Date();
        await collection.updateOne({ email: email }, { $set: existingUser });
        const payload = { user: { id: existingUser._id } };
        const authtoken = jwt.sign(payload, JWT_SECRET);
        res.json({ authtoken });
    } catch (e) {
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
