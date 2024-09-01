import request from 'supertest';
import express, { Express } from 'express';
import { Status } from '../../src/interfaces/AppealRecord';
import { AppealController } from '../../src/controllers/appealController';
import { AppealModel } from '../../src/models/appealModel';
import { connectDB, disconnectDB, initialize } from '../../src/config/database';
import { AttendanceModel } from '../../src/models/attendanceModel';

describe('AppealController Functional Tests with Database', () => {
    let app: Express;

    beforeAll(async () => {
        await connectDB('test');  // Connect to the test database
        app = express();
        app.use(express.json());

        const appealController = new AppealController();
        app.get('/appeals', appealController.fetchAllAppealRecords);
        app.post('/appeal/new', appealController.newAppealRecord);
        app.post('/appeal/process', appealController.processAppealRecord);
    });

    afterAll(async () => {
        await disconnectDB();  // Disconnect from the database after all tests
    });

    beforeEach(async () => {
        await initialize();  // Clear the database after each test to ensure isolation
    });

    it('should fetch all appeal records successfully', async () => {
        // Assuming the service will interact with the actual database
        const response = await request(app).get('/appeals');

        expect(response.status).toBe(200);
        expect(response.body.appeals).toBeInstanceOf(Array);
    });

    it('should create a new appeal record successfully', async () => {
        const response = await request(app)
            .post('/appeal/new')
            .send({ uin: '12345678', courseId: '3004', checkInTime: new Date(), reason: 'Valid Reason' });

        expect(response.status).toBe(302); // Assuming redirect to '/'
        // Optionally, fetch the created record from the database to verify its existence
    });

    it('should not create a new appeal record with missing parameters', async () => {
        const response = await request(app)
            .post('/appeal/new')
            .send({ courseId: '3004', checkInTime: new Date(), reason: 'Valid Reason' });

        expect(response.status).toBe(400);
    });

    it('should not create a new appeal record when already appealed', async () => {
        const data = { uin: '12345678', courseId: '3002', checkInTime: new Date(), reason: 'Valid Reason' };
        const response = await request(app)
            .post('/appeal/new')
            .send(data);

        const appealModel = new AppealModel();
        expect(response.status).toBe(302);
        const appealRecord = await appealModel.findAppealRecordByCourseIdAndUIN(data.uin, data.courseId);
        expect(appealRecord?.reason).not.toBe(data.reason);
    });

    it('should not create a new appeal record when class alreay attended', async () => {
        const data = { uin: '12345678', courseId: '3001', checkInTime: new Date(), reason: 'Valid Reason' };
        const response = await request(app)
            .post('/appeal/new')
            .send(data);

        const appealModel = new AppealModel();
        expect(response.status).toBe(302);
        expect(await appealModel.findAppealRecordByCourseIdAndUIN(data.uin, data.courseId)).toBe(null);
    });

    it('should not process an appeal record with missing parameters', async () => {
        const response = await request(app)
            .post('/appeal/process')
            .send({ status: 'APPROVED' });

        expect(response.status).toBe(400);
    });

    it('should not process an appeal record with invalid _id', async () => {
        const data = { uin: '12345678', courseId: '3004', checkInTime: new Date(), reason: 'Valid Reason' };
        // First, create a new appeal record directly via the database or service
        const newAppeal = await request(app)
            .post('/appeal/new')
            .send(data);

        const appealModel = new AppealModel();
        const attendanceModel = new AttendanceModel();
    
        const record = await appealModel.findAppealRecordByCourseIdAndUIN(data.uin, data.courseId);
        
        // Then, approve the appeal
        const response = await request(app)
        .post('/appeal/process')
        .send({ _id: 'randomId', status: 'APPROVED' });
        
        expect(response.status).toBe(302); // Assuming redirect to '/'
        
        const appealId: string = record?._id?.toString() || 'defaultId';
        const newAppealRecord = await appealModel.findAppealRecordByAppealId(appealId);
        const newAttendance = await attendanceModel.findAttendanceByCourseIdAndUIN(data.uin, data.courseId);
        // Optionally, fetch the updated record from the database to verify the status change
        expect(newAppealRecord?.status).toBe(Status.PENDING);
        expect(newAttendance).toBe(null);
    });

    it('should approve an appeal record successfully', async () => {
        const data = { uin: '12345678', courseId: '3004', checkInTime: new Date(), reason: 'Valid Reason' };
        // First, create a new appeal record directly via the database or service
        const appealModel = new AppealModel();
        const attendanceModel = new AttendanceModel();
    
        await appealModel.insertAppealRecord(data.uin, data.courseId, data.checkInTime, data.reason);
        const record = await appealModel.findAppealRecordByCourseIdAndUIN(data.uin, data.courseId);
        
        // Then, approve the appeal
        const response = await request(app)
        .post('/appeal/process')
        .send({ _id: record?._id, status: 'APPROVED' });
        
        expect(response.status).toBe(302); // Assuming redirect to '/'
        
        const appealId: string = record?._id?.toString() || 'defaultId';
        const newAppealRecord = await appealModel.findAppealRecordByAppealId(appealId);
        const newAttendance = await attendanceModel.findAttendanceByCourseIdAndUIN(data.uin, data.courseId);
        // Optionally, fetch the updated record from the database to verify the status change
        expect(newAppealRecord?.status).toBe(Status.APPROVED);
        expect(newAttendance).not.toBe(null);
    });

    it('should reject an appeal record successfully', async () => {
        const data = { uin: '12345678', courseId: '3004', checkInTime: new Date(), reason: 'Valid Reason' };
        // First, create a new appeal record directly via the database or service

        const appealModel = new AppealModel();
        const attendanceModel = new AttendanceModel();
    
        await appealModel.insertAppealRecord(data.uin, data.courseId, data.checkInTime, data.reason);
        const record = await appealModel.findAppealRecordByCourseIdAndUIN(data.uin, data.courseId);
        
        // Then, approve the appeal
        const response = await request(app)
        .post('/appeal/process')
        .send({ _id: record?._id, status: 'REJECTED' });
        
        expect(response.status).toBe(302); // Assuming redirect to '/'
        
        const appealId: string = record?._id?.toString() || 'defaultId';
        const newAppealRecord = await appealModel.findAppealRecordByAppealId(appealId);
        const newAttendance = await attendanceModel.findAttendanceByCourseIdAndUIN(data.uin, data.courseId);
        // Optionally, fetch the updated record from the database to verify the status change
        expect(newAppealRecord?.status).toBe(Status.REJECTED);
        expect(newAttendance).toBe(null);
    });
});
