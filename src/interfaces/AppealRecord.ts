import { ObjectId } from 'mongodb';

export enum Status {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
};
export interface AppealRecord {
    _id?: ObjectId;
    uin: string;
    courseId: string;
    reason: string;
    checkInTime: Date;
    status: Status;
}