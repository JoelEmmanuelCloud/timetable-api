import express from 'express';
import {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  // updateUser,
  // updateUserPassword,
} from '../controllers/user-controller';
import {
  authenticateUser,
  authorizePermissions
} from '../middleware/authentication';
import { AcademyRole } from '../interfaces'; 

const router = express.Router();

router
  .route('/')
  .get(authenticateUser, authorizePermissions(AcademyRole.TimetableOfficer), getAllUsers);

router.route('/showUser').get(authenticateUser, showCurrentUser);
// router.route('/updateUser').patch(authenticateUser, updateUser);
// router.route('/updateUserPassword').patch(authenticateUser, updateUserPassword);

router.route('/:id').get(authenticateUser, getSingleUser);

export default router;
