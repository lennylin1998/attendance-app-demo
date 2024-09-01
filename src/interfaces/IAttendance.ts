export interface IAttendance {
    uin: string; // what is the student uin, for example, 12345678
    courseId: string; // what was the date the class took attendance, for example 09222024
    // takenBy: string; // who took this attendance, for example “user1234”
    date: Date; // when is the attendance taken, for example “2024-02-09T07:40:17.469Z”
}

