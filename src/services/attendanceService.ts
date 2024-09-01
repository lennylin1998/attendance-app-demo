import { AttendanceModel } from '../models/attendanceModel';
import { StudentModel } from '../models/studentModel';
import { CourseScheduleModel } from '../models/courseScheduleModel';

export class AttendanceService {
    private studentModel: StudentModel;
    private attendanceModel: AttendanceModel;
    private courseScheduleModel: CourseScheduleModel;

    constructor() {
        this.studentModel = new StudentModel();
        this.attendanceModel = new AttendanceModel();
        this.courseScheduleModel = new CourseScheduleModel();
    }

    async getAttendanceByUIN(uin: string) : Promise<any> {
        const records = await this.attendanceModel.findAttendanceByUIN(uin);
        const student = await this.studentModel.findStudentByUIN(uin);
        const courses = await this.courseScheduleModel.findCourseScheduleByUIN(uin);
        return { name: student?.name, attendance: records, courses: courses };
    };
}
// export const getAttendanceByUIN = async (uin: string) => {
//     const studentModel = new StudentModel();
//     const courseScheduleModel = new CourseScheduleModel();
//     const attendanceModel = new AttendanceModel();
//     const records = await attendanceModel.findAttendanceByUIN(uin);
//     const student = await studentModel.findStudentByUIN(uin);
//     const courses = await courseScheduleModel.findCourseScheduleByUIN(uin);
//     return { name: student?.name, attendance: records, courses: courses };
// };