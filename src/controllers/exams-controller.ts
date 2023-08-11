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
        
        const examsByDate: { [date: string]: ExamDocument[] } = exams.reduce((acc, exam) => {
            const examDate = exam.date;
            if (!acc[examDate]) {
                acc[examDate] = [];
            }
            acc[examDate].push(exam);
            return acc;
        }, {} as { [date: string]: ExamDocument[] }); 

        
        for (const date in examsByDate) {
            examsByDate[date].sort((a, b) => {
                const timeA = a.time.split(" ")[0]; 
                const timeB = b.time.split(" ")[0];
                return timeB.localeCompare(timeA); 
            });
        }

        res.status(StatusCodes.OK).json({ examsByDate });
    }, res);
};


// const getAllExams = async (req: Request, res: Response): Promise<void> => {
//     await handleAsyncError(async () => {
//         const exams = await ExamModel.find().sort({ date: 1, time: 1 }); // Sorting by date and time

//         // Group exams by date
//         const examsByDate: { [date: string]: ExamDocument[] } = exams.reduce((acc, exam) => {
//             const examDate = exam.date;
//             if (!acc[examDate]) {
//                 acc[examDate] = [];
//             }
//             acc[examDate].push(exam);
//             return acc;
//         }, {} as { [date: string]: ExamDocument[] }); // Provide initial type annotation here

//         res.status(StatusCodes.OK).json({ examsByDate });
//     }, res);
// };






// export const getStructuredExamsByLevel = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const { level } = req.query; // Get academic level from query parameters
//         const filter = level ? { level: level.toString() } : {};

//         const exams = await ExamModel.find(filter).sort({ date: 1, time: 1 }); // Sorting by date and time

//         // Group exams by date
//         const examsByDate = exams.reduce((acc, exam) => {
//             const examDate = exam.date;
//             if (!acc[examDate]) {
//                 acc[examDate] = [];
//             }
//             acc[examDate].push(exam);
//             return acc;
//         }, {});

//         res.status(StatusCodes.OK).json({ examsByDate });
//     } catch (error: any) {
//         console.error(error);
//         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//             error: 'An error occurred while fetching and structuring exam data',
//         });
//     }
// };



export {
    addExam,
    getAllExams,
};