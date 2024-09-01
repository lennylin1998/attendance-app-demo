import { Router } from 'express';
import { AttendanceController } from '../controllers/attendanceController';

// const router = Router();

// let attendanceController: AttendanceController;

export function setupAttendanceRoutes(router: Router) {
    const attendanceController = new AttendanceController();
    router.get('/attendance/:uin', attendanceController.fetchAttendanceByUIN);
}