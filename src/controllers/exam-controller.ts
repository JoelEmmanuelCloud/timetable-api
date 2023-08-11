import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { handleAsyncError } from '../middleware';
import ExamModel from '../models/exams';



const addExam = async (req: Request, res: Response): Promise<void> => {
    await handleAsyncError(async () => {
        const { course } = req.body;

        // Check if an exam with the same course already exists
        const existingExam = await ExamModel.findOne({ course });

        if (existingExam) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: 'An exam with the same course already exists in the database.',
            });
        }

        // If no exam with the same course exists, add the new exam
        const newExam = new ExamModel(req.body);

        const savedExam = await newExam.save();

        res.status(StatusCodes.CREATED).json({ exam: savedExam });
    }, res);
};

export default addExam;







// export const getStructuredExams = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const exams = await ExamModel.find().sort({ date: 1, time: 1 }); // Sorting by date and time

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



