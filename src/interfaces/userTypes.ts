import { Document } from 'mongoose';

export enum AcademyRole {
    TimetableOfficer = 'timetableOfficer',
    Student = 'student',
    Lecturer = 'lecturer',
}

export interface IUser extends Document {
    userId: string;
    name: string;
    email: string;
    password: string;
    academyRole: AcademyRole;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface User {
    name: string;
    _id: string;
    academyRole: AcademyRole;
}
