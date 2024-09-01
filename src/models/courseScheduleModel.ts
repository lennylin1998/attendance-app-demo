import { getDB } from '../config/database';
import { Collection } from 'mongodb';

export class CourseScheduleModel {
    private courseScheduleCollection: Collection;

    constructor() {
        this.courseScheduleCollection = getDB().collection('courseSchedule');
    }

    async findCourseScheduleByUIN(uin: string) {
        return this.courseScheduleCollection.find(
            { uin: uin },
            { projection: { _id: 0, uin: 0 } }
        ).toArray();
    }
};
// const courseScheduleCollection = () => getDB().collection('courseSchedule');
