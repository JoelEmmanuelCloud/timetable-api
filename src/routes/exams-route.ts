import express from 'express';

import {
    addExam,
    getAllExams,
    getExamsByLevel,
} from '../controllers/exams-controller';

import { authenticateUser, authorizePermissions } from '../middleware';
import { AcademyRole } from '../interfaces';

const router = express.Router();

router
    .route('/addExam')
    .post(
        authenticateUser,
        authorizePermissions(AcademyRole.TimetableOfficer),
        addExam,
    );
router
    .route('/getAllExams')
    .get(
        authenticateUser,
        authorizePermissions(AcademyRole.TimetableOfficer),
        getAllExams,
    );
router
    .route('/getExamsByLevel')
    .get(
        authenticateUser,
        authorizePermissions(AcademyRole.TimetableOfficer),
        getExamsByLevel,
    );

export default router;
