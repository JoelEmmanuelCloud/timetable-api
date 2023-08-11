import mongoose from "mongoose";
import { ExamDocument } from "../interfaces";

const ExamSchema = new mongoose.Schema({
    date: String,
    day: String,
    level: String,
    morning: {
        course: [String],
        time: String,
        venue: String,
        supervisor: String,
        lecturers: [String],
        invigilators: [String],
    },
    afternoon: {
        course: [String],
        time: String,
        venue: String,
        supervisor: String,
        lecturers: [String],
        invigilators: [String],
    },
});

const ExamModel = mongoose.model<ExamDocument>('Exam', ExamSchema);

export default ExamModel;
