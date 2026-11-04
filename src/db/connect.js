import { MongoClient } from 'mongodb';
import { setServers } from 'node:dns';

setServers(['1.1.1.1', '1.0.0.1']);

let database;

const connectToDb = async () => {
    const connectionString = process.env.MONGODB_URI;

    if (!connectionString) {
        throw new Error('MONGODB_URI is required.');
    }

    const client = new MongoClient(connectionString);

    await client.connect();

    database = client.db(process.env.MONGODB_DB_NAME || 'practice');

    return database;
};

const getDb = () => {
    if (!database) {
        throw new Error('Database not initialized. Call connectToDb first.');
    }

    return database;
};

export { connectToDb, getDb };