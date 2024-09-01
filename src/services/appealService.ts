import { Status } from '../interfaces/AppealRecord';
import { IAttendance } from '../interfaces/IAttendance';
import { AppealModel } from '../models/appealModel';
import { AttendanceModel } from '../models/attendanceModel';

export class AppealService {
    public appealModel: AppealModel;
    public attendanceModel: AttendanceModel;

    constructor() {
        this.appealModel = new AppealModel();
        this.attendanceModel = new AttendanceModel();
    }

    async getAllAppealRecords() {
        const records = await this.appealModel.findAllAppealRecords();
        return { appeals: records };
    };
    
    async createAppealRecord(uin: string, courseId: string, checkInTime: Date, reason: string): Promise<boolean> {
        if (await this.appealModel.findAppealRecordByCourseIdAndUIN(uin, courseId)) {
            return false;
        }

        if (await this.attendanceModel.findAttendanceByCourseIdAndUIN(uin, courseId) != null) {
            return false;
        }
        
        await this.appealModel.insertAppealRecord(uin, courseId, checkInTime, reason);
        return true;
    };
    
    async modifyAppealRecord(_id: string, status: Status) : Promise<void> {
        const record = await this.appealModel.findAppealRecordByAppealId(_id);
        if (record == null) {
            return;
        }
        await this.appealModel.editAppealRecord(_id, status);
    
        if (status == Status.REJECTED) {
            return;
        }

        const attendanceData: IAttendance = {
            courseId: record.courseId,
            uin: record.uin,
            date: record.checkInTime,
        };
        await this.attendanceModel.insertAttendanceRecord(attendanceData);
    }
}
