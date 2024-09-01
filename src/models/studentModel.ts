import { Student } from '../interfaces/Student';
import { getDB } from '../config/database';
import { Collection } from 'mongodb';

export class StudentModel {
    private studentCollection: Collection<Student>;

    constructor() {
        this.studentCollection = getDB().collection<Student>('student');
    }

    async findStudentByUIN(uin: string): Promise<Omit<Student, 'uin'> | null> {
        return await this.studentCollection.findOne(
            { uin: uin },
            { projection: { _id: 0, uin: 0 } }
        );
    };
}

// const studentCollection = () => getDB().collection<Student>('student');
