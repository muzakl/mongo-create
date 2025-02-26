import express from 'express';
import cors from 'cors';
import { connectToDatabase } from "./services/database.js";
import bodyParser from "body-parser";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

app.get('/accounts', async (req, res) => {
    try {
        const database = await connectToDatabase();
        const accounts = database.collection('accounts');
        const cursor = accounts.find().limit(50);
        const result = await cursor.toArray();

        res.json(result);
    } catch (error) {
        console.error('Error handling request:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /accounts - Insert a new account
app.post('/accounts', async (req, res) => {
    try {
        const database = await connectToDatabase();
        const accounts = database.collection("accounts");

        const lastAccount = await accounts.find().sort({ accountId: -1 }).limit(1).toArray();
        const lastId = lastAccount.length > 0 ? lastAccount[0].accountId : 371138;

        const newAccount = {
            accountId: lastId + 1,
            limit: req.body.limit
        };

        // Insert into database
        const result = await accounts.insertOne(newAccount);

        console.log(`Inserted 1 document with accountId: ${newAccount.accountId}`);
        res.status(201).json({ message: "Account created", accountId: newAccount.accountId });
    } catch (error) {
        console.error('Error inserting account:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
