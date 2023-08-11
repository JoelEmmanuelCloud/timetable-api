import express from "express";

import addExam from "../controllers/exam-controller";

import {
    authenticateUser,
    authorizePermissions,
} from '../middleware';
import { AcademyRole } from '../interfaces';


const router = express.Router();


router
    .route('/addExam')
    .post(
        authenticateUser,
        authorizePermissions(AcademyRole.TimetableOfficer),
        addExam,
    );

export default router;