// import { ObjectId } from 'mongodb';
import { IAttendance } from '../interfaces/IAttendance';
import { getDB } from '../config/database';
import { Collection } from 'mongodb';

export class AttendanceModel {
    private attendanceCollection: Collection<IAttendance>;

    constructor() {
        this.attendanceCollection = getDB().collection<IAttendance>('attendance');
    }

    async findAttendanceByUIN(uin: string): Promise<IAttendance[] | null> {
        return await this.attendanceCollection.find(
            { uin: uin },
            { projection: { _id: 0, uin: 0 } }
        ).toArray();
    };

    async findAttendanceByCourseIdAndUIN(uin: string, courseId: string): Promise<IAttendance | null> {
        return await this.attendanceCollection.findOne({ uin: uin, courseId: courseId });
    };

    async insertAttendanceRecord(attendance: IAttendance): Promise<void> {
        await this.attendanceCollection.insertOne(attendance);
    };

}
// const attendanceCollection = () => getDB().collection<IAttendance>('attendance');

// export const findAttendanceByUIN = async (uin: string): Promise<IAttendance[]> => {
//     return await attendanceCollection().find(
//         { uin: uin },
//         { projection: { _id: 0, uin: 0 } }
//     ).toArray();
// };

// export const findAttendanceByCourseIdAndUIN = async (uin: string, courseId: string): Promise<IAttendance | null> => {
//     return await attendanceCollection().findOne({ uin: uin, courseId: courseId });
// };

// export const insertAttendanceRecord = async (attendance: IAttendance) => {
//     await attendanceCollection().insertOne(attendance);
// };