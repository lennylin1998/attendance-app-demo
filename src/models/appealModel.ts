import { Status, AppealRecord } from '../interfaces/AppealRecord';
import { getDB } from '../config/database';
import { ObjectId } from 'mongodb';
import { Collection } from 'mongodb';

export class AppealModel {
    private appealCollection: Collection<AppealRecord>;

    constructor() {
        this.appealCollection = getDB().collection<AppealRecord>('appeal');
    }

    async findAllAppealRecords(): Promise<any[] | null> {
        return await this.appealCollection.aggregate([
            {
                $lookup: {
                    from: 'student',
                    localField: 'uin',
                    foreignField: 'uin',
                    as: 'student'
                },
            },
            {
                $unwind: '$student'
            },
            {
                $project: {
                    'student.uin': 0,
                    'student._id': 0
                }
            }
        ]).toArray();
    };

    async findAppealRecordByCourseIdAndUIN(uin: string, courseId: string) : Promise<AppealRecord | null> {
        return await this.appealCollection.findOne({ uin: uin, courseId: courseId });
    };

    async findAppealRecordByAppealId(_id: string) : Promise<AppealRecord | null> {
        if (!ObjectId.isValid(_id)) {
            return null;
        }
        return await this.appealCollection.findOne({ _id: new ObjectId(_id) });
    };

    async insertAppealRecord(uin: string, courseId: string, checkInTime: Date, reason: string): Promise<void> {
        await this.appealCollection.insertOne({ uin, courseId, checkInTime, reason, status: Status.PENDING });
    };

    async editAppealRecord(_id: string, status: Status): Promise<void> {
        await this.appealCollection.updateOne(
            { _id: new ObjectId(_id) },
            { $set: { 'status': status } }
        );
    };
};
// const appealCollection = () => getDB().collection<AppealRecord>('appeal');

// export const findAllAppealRecords = async () => {
//     return await appealCollection().aggregate([
//         {
//             $lookup: {
//                 from: 'student',
//                 localField: 'uin',
//                 foreignField: 'uin',
//                 as: 'student'
//             },
//         },
//         {
//             $unwind: '$student'
//         },
//         {
//             $project: {
//                 'student.uin': 0,
//                 'student._id': 0
//             }
//         }
//     ]).toArray();
// };

// export const findAppealRecordByCourseIdAndUIN = async (uin: string, courseId: string) : Promise<AppealRecord | null> => {
//     return await appealCollection().findOne({ uin: uin, courseId: courseId });
// }

// export const findAppealRecordByAppealId = async (_id: string) : Promise<AppealRecord | null> => {
//     return await appealCollection().findOne({ _id: new ObjectId(_id) });
// }

// export const insertAppealRecord = async (uin: string, courseId: string, checkInTime: Date, reason: string) => {
//     await appealCollection().insertOne({ uin, courseId, checkInTime, reason, status: false });
// };

// export const editAppealRecord = async (_id: string) => {
//     const result = await appealCollection().updateOne(
//         { _id: new ObjectId(_id) },
//         { $set: { 'status': true } }
//     );
// };

