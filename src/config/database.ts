import { MongoClient, Db } from 'mongodb';
import { Status } from '../interfaces/AppealRecord';

const url = "mongodb+srv://user1:FE9eGsdsDVIze8fn@cluster81137.m8xzk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster81137";
// const dbName = 'demo';

let client: MongoClient;
let db: Db;

const connectDB = async (dbName: string) => {
    try {
        client = new MongoClient(url);
        await client.connect();
        db = client.db(dbName);
        console.log('MongoDB connected');
    } catch (error) {
        console.log("MongoDB connection failed...");
        console.error(error);
        process.exit(1);
    } 
};

const getDB = () : Db => {
    if (!db) {
        throw new Error('Database not connected');
    }
    return db;
}

const initialize = async () => {
  
    // List all collections and drop them
    const collections = await db.listCollections().toArray();
    for (const collection of collections) {
        await db.collection(collection.name).deleteMany({});
        console.log(`Cleared collection: ${collection.name}`);
    }
  
    // Example: Insert a new entry into the 'users' collection
    const newStudent = { uin: '12345678', name: 'Adam' };
    const courseSchedule = [
        { uin: '12345678', courseId: '3001'},
        { uin: '12345678', courseId: '3002'},
        { uin: '12345678', courseId: '3003'},
        { uin: '12345678', courseId: '3004'},
    ];
    const attendanceRecords = [
        { uin: '12345678', courseId: '3001', date: "2024-08-29T09:40:17.469Z" },
        { uin: '12345678', courseId: '3002', date: "2024-08-29T15:32:59.345Z" },
        { uin: '12345678', courseId: '3003', date: "2024-08-30T12:20:21.129Z" },
    ];
    const appealRecords = { uin: '12345678', courseId: '3002', checkInTime: "2024-08-29T15:32:59.345Z", reason: 'forgot...', status: Status.APPROVED };


    const studentCollection = db.collection('student');
    const courseScheduleCollection = db.collection('courseSchedule');
    const attendanceCollection = db.collection('attendance');
    const appealCollection = db.collection('appeal');

    await studentCollection.insertOne(newStudent);
    console.log('Inserted initial student:', newStudent);
    
    await courseScheduleCollection.insertMany(courseSchedule);
    console.log('Inserted course schedule:', courseSchedule);

    await attendanceCollection.insertMany(attendanceRecords);
    console.log('Inserted attendance records:', attendanceRecords);
    
    await appealCollection.insertOne(appealRecords);
    console.log('Inserted appeal records:', appealRecords);

};

const disconnectDB = async () => {
    await client.close();
}

export const clearDB = async () => {
    const collections = await db.listCollections().toArray();
    for (const collection of collections) {
        await db.collection(collection.name).deleteMany({});
        console.log(`Cleared collection: ${collection.name}`);
    }
};

export { connectDB, getDB, initialize, disconnectDB };
