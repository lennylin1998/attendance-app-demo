import { AppealService } from '../../src/services/appealService';
import { AppealModel } from '../../src/models/appealModel';
import { AttendanceModel } from '../../src/models/attendanceModel';
import { Status } from '../../src/interfaces/AppealRecord';
// import { getDB } from '../../src/config/database.js';
import { ObjectId } from 'mongodb';
import { jest } from '@jest/globals';

// Mocking the getDB function
jest.mock('../../src/config/database', () => ({
    getDB: jest.fn(),
}));

// Mocking the AppealModel and AttendanceModel
jest.mock('../../src/models/appealModel');
jest.mock('../../src/models/attendanceModel');

describe('AppealService', () => {
    let appealService: AppealService;
    let appealModel: jest.Mocked<AppealModel>;
    let attendanceModel: jest.Mocked<AttendanceModel>;

    beforeEach(() => {
        // Resetting mocks before each test
        jest.clearAllMocks();

        // Creating instances of the mocked models
        appealModel = new AppealModel() as jest.Mocked<AppealModel>;
        attendanceModel = new AttendanceModel() as jest.Mocked<AttendanceModel>;

        // Replacing the original models with mocked ones
        appealService = new AppealService();
        appealService.appealModel = appealModel;
        appealService.attendanceModel = attendanceModel;
        
    });

    it('should create a new appeal record when attendance is not found', async () => {
        attendanceModel.findAttendanceByCourseIdAndUIN.mockResolvedValue(null);
        appealModel.insertAppealRecord.mockResolvedValue();

        const result = await appealService.createAppealRecord('12345678', 'COURSE123', new Date(), 'Valid Reason');

        expect(result).toBe(true);
        expect(attendanceModel.findAttendanceByCourseIdAndUIN).toHaveBeenCalledTimes(1);
        expect(appealModel.insertAppealRecord).toHaveBeenCalledTimes(1);
    });

    it('should not create a new appeal record when already appealed', async () => {
        attendanceModel.findAttendanceByCourseIdAndUIN.mockResolvedValue(null);
        appealModel.findAppealRecordByCourseIdAndUIN.mockResolvedValue({uin: '12345678', courseId: 'COURSE123', checkInTime: new Date(), reason: 'Valid Reason', status: Status.PENDING});

        const result = await appealService.createAppealRecord('12345678', 'COURSE123', new Date(), 'Valid Reason');

        // expect(result).toBe(false);
        expect(appealModel.findAppealRecordByCourseIdAndUIN).toHaveBeenCalledTimes(1);
        expect(attendanceModel.findAttendanceByCourseIdAndUIN).not.toHaveBeenCalled();
        expect(appealModel.insertAppealRecord).not.toHaveBeenCalled();
    });
    
    it('should not create a new appeal record when attendance is found', async () => {
        attendanceModel.findAttendanceByCourseIdAndUIN.mockResolvedValue({ uin: '12345678', courseId: '3001', date: new Date() });

        const result = await appealService.createAppealRecord('12345678', 'COURSE123', new Date(), 'Valid Reason');

        // expect(result).toBe(false);
        expect(appealModel.findAppealRecordByCourseIdAndUIN).toHaveBeenCalledTimes(1);
        expect(attendanceModel.findAttendanceByCourseIdAndUIN).toHaveBeenCalledTimes(1);
        expect(appealModel.insertAppealRecord).not.toHaveBeenCalled();
    });


    it('should modify the appeal record and insert attendance record if status is approved', async () => {
        const mockAppealRecord = { _id: new ObjectId(), courseId: 'COURSE123', uin: '12345678', checkInTime: new Date(), reason: 'reason...', status: Status.PENDING };
        appealModel.findAppealRecordByAppealId.mockResolvedValue(mockAppealRecord);
        appealModel.editAppealRecord.mockResolvedValue();
        attendanceModel.insertAttendanceRecord.mockResolvedValue();

        await appealService.modifyAppealRecord('1', Status.APPROVED);

        expect(appealModel.findAppealRecordByAppealId).toHaveBeenCalledTimes(1);
        expect(appealModel.editAppealRecord).toHaveBeenCalledTimes(1);
        expect(attendanceModel.insertAttendanceRecord).toHaveBeenCalledTimes(1);
    });

    it('should modify the appeal record but not insert attendance record if status is rejected', async () => {
        const mockAppealRecord = { _id: new ObjectId(), courseId: 'COURSE123', uin: '12345678', checkInTime: new Date(), reason: 'reason...', status: Status.PENDING };
        appealModel.findAppealRecordByAppealId.mockResolvedValue(mockAppealRecord);

        await appealService.modifyAppealRecord('1', Status.REJECTED);

        expect(appealModel.findAppealRecordByAppealId).toHaveBeenCalledTimes(1);
        expect(appealModel.editAppealRecord).toHaveBeenCalledTimes(1);
        expect(attendanceModel.insertAttendanceRecord).not.toHaveBeenCalled();
    });

    it('should not modify or insert attendance record if appeal record is not found', async () => {
        appealModel.findAppealRecordByAppealId.mockResolvedValue(null);

        await appealService.modifyAppealRecord('1', Status.APPROVED);

        expect(appealModel.findAppealRecordByAppealId).toHaveBeenCalledTimes(1);
        expect(appealModel.editAppealRecord).not.toHaveBeenCalled();
        expect(attendanceModel.insertAttendanceRecord).not.toHaveBeenCalled();
    });
});
