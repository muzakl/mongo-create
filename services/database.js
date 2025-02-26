import {MongoClient} from "mongodb";
const uri = "mongodb+srv://muzakl:1234@cluster0.mnnz1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri);

async function connectToDatabase() {
    try {
        await client.connect();
        console.log("Connected to the database");
        return client.db('sample_analytics');
    } catch (error) {
        console.error("Error connecting to the database:", error);
        throw error;
    }
}

export {connectToDatabase, client};