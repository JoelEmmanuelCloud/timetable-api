import { Document } from 'mongoose';

export interface Exam {
    date: string;
    day: string;
    level: string;
    course: string;
    time: string;
    venue: string;
    supervisor: string[];
    lecturers: string[];
    invigilators: string[];
}

export interface ExamDocument extends Document, Exam {}
