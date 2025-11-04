import express from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';

const app = express();
app.use(cors());
app.use(express.json());

const url = "mongodb+srv://admin:admin@cluster0.ho7ujio.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const dbName = "erp";
const client = new MongoClient(url);

let db;

// Connect to MongoDB once when server starts
async function connectDB() {
    try {
        await client.connect();
        db = client.db(dbName);
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("Failed to connect to MongoDB", err);
        process.exit(1);
    }
}

connectDB();

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// Testing service
app.get("/", (req, res) => {
    res.status(200).json("Hello World from Express JS");
});

// SIGN UP OPERATION
app.post("/signup", async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json("Request body is empty");
        }

        await db.collection("users").insertOne(req.body);
        res.status(200).json("Registered Successfully");
    } catch (err) {
        console.error(err);
        res.status(500).json("Internal Server Error");
    }
});

// LOGIN OPERATION
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json("Missing credentials");

        const user = await db.collection("users").findOne({ email, password });
        if (!user)
            return res.status(200).json("301::Invalid Credentials!");

        res.status(200).json("300::Login Success");
    } catch (err) {
        console.error(err);
        res.status(500).json("Internal Server Error");
    }
});
app.post("/getfullname", async (req, res)=>{
    try
    {
        await client.connect(); //Establish connection with MongoDB
        const db = client.db(dbName); //Connecting wit the DB

        const user = await db.collection("users").findOne({email: req.body.email});
        if(!user)
            return res.status(200).json("301::Invalid User!");

        res.status(200).json(user);
    }catch(err)
    {
        console.log(err);
    }finally
    {
        await client.close(); // Close the Connection
    }
});

