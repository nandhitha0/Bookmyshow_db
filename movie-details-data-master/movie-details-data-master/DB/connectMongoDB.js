import { MongoClient } from 'mongodb';

const connectMongoDB = async () => {
    try {
        const client = new MongoClient(process.env.MONGODB_URL, { });
        await client.connect();
        console.log('Connected to MongoDB');
        global.db = client.db('movie_application'); // " movie_application " Collection 
    } catch (error) {
        console.error('Error connecting to MongoDB', error);
        process.exit(1);
    }
};

export default connectMongoDB;
