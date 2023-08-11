import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { handleAsyncError } from '../middleware';
import ExamModel from '../models/exams';
import { ExamDocument } from '../interfaces';

const addExam = async (req: Request, res: Response): Promise<void> => {
    await handleAsyncError(async () => {
        const { course } = req.body;

        const existingExam = await ExamModel.findOne({ course });

        if (existingExam) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: 'An exam with the same course already exists in the database.',
            });
        }

        const newExam = new ExamModel(req.body);

        const savedExam = await newExam.save();

        res.status(StatusCodes.CREATED).json({ exam: savedExam });
    }, res);
};

const getAllExams = async (req: Request, res: Response): Promise<void> => {
    await handleAsyncError(async () => {
        const exams = await ExamModel.find().sort({ date: 1, time: 1 });

        const examsByDate: { [date: string]: ExamDocument[] } = exams.reduce(
            (acc, exam) => {
                const examDate = exam.date;
                if (!acc[examDate]) {
                    acc[examDate] = [];
                }
                acc[examDate].push(exam);
                return acc;
            },
            {} as { [date: string]: ExamDocument[] },
        );

        for (const date in examsByDate) {
            examsByDate[date].sort((a, b) => {
                const timeA = a.time.split(' ')[0];
                const timeB = b.time.split(' ')[0];
                return timeB.localeCompare(timeA);
            });
        }

        res.status(StatusCodes.OK).json({ examsByDate });
    }, res);
};

const getExamsByLevel = async (req: Request, res: Response): Promise<void> => {
    await handleAsyncError(async () => {
        const { level } = req.query;
        const filter = level ? { level: level.toString() } : {};

        const exams = await ExamModel.find(filter).sort({ date: 1, time: -1 });

        if (exams.length === 0) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: `No exams found for the specified level: ${level}`,
            });
        }

        const examsByDateAndTime: {
            [date: string]: { [time: string]: ExamDocument[] };
        } = exams.reduce(
            (acc, exam) => {
                const examDate = exam.date;
                const examTime = exam.time;

                if (!acc[examDate]) {
                    acc[examDate] = {};
                }

                if (!acc[examDate][examTime]) {
                    acc[examDate][examTime] = [];
                }

                acc[examDate][examTime].unshift(exam);

                return acc;
            },
            {} as { [date: string]: { [time: string]: ExamDocument[] } },
        );

        res.status(StatusCodes.OK).json({ examsByDateAndTime });
    }, res);
};

export { addExam, getAllExams, getExamsByLevel };
