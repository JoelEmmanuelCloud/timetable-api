import { Document } from 'mongoose';

export enum AcademyRole {
    TimetableOfficer = 'timetable officer',
    Student = 'student',
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
    userId: string;
    name: string;
    email: string;
    academyRole: AcademyRole;
}
