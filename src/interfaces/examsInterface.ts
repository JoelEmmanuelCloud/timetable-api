import { Document } from 'mongoose';

export interface Exam {
    date: string;
    day: string;
    level: string;
    morning?: {
        course: string[] | string;
        time: string;
        venue: string;
        supervisor: string;
        lecturers: string[];
        invigilators: string[];
    };
    afternoon?: {
        course: string[] | string;
        time: string;
        venue: string;
        supervisor: string;
        lecturers: string[];
        invigilators: string[];
    };
}

export interface ExamDocument extends Document, Exam {}