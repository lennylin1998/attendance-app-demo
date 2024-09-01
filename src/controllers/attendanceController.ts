import { Request, Response } from 'express';
import { AttendanceService } from '../services/attendanceService';


export class AttendanceController {
    private attendanceService: AttendanceService;

    constructor() {
        console.log("attendance controller created: ", this);
        this.attendanceService = new AttendanceService();
        this.fetchAttendanceByUIN = this.fetchAttendanceByUIN.bind(this);
    }
    async fetchAttendanceByUIN(req: Request, res: Response): Promise<void> {
        try {
            console.log(this);
            const attendance = await this.attendanceService.getAttendanceByUIN(req.params.uin);
            res.status(200).json(attendance);
        } catch (error) {
            if (error instanceof Error) {
                // Now TypeScript knows `error` is of type `Error`
                res.status(500).json({ error: error.message });
            }
        }
    };
};
