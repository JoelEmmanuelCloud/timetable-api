import mongoose from 'mongoose';
import { ExamDocument } from '../interfaces';

const ExamSchema = new mongoose.Schema({
    date: String,
    day: String,
    level: String,
    course: String,
    time: String,
    venue: String,
    supervisors: [String],
    lecturers: [String],
    invigilators: [String],
}, { timestamps: true });

const ExamModel = mongoose.model<ExamDocument>('Exam', ExamSchema);

export default ExamModel;
