import mongoose, { Model } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import { IUser, AcademyRole } from '../interfaces/userTypes';

const isEmailValidator = (value: string) => {
    return validator.isEmail(value);
};

const UserSchema = new mongoose.Schema<IUser>(
    {
        name: {
            type: String,
            required: [true, 'Please provide name'],
            minlength: 3,
            maxlength: 50,
        },
        email: {
            type: String,
            unique: true,
            required: [true, 'Please provide email'],
            validate: {
                validator: isEmailValidator,
                message: 'Please provide valid email',
            },
        },
        password: {
            type: String,
            required: [true, 'Please provide password'],
            minlength: 6,
        },
        academyRole: {
          type: String,
          enum: [AcademyRole.TimetableOfficer, AcademyRole.Student],
          default: AcademyRole.Student,
        },
    },
    { timestamps: true },
);

UserSchema.pre<IUser>('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (
    candidatePassword: string,
) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
};

const UserModel: Model<IUser> = mongoose.model<IUser>('User', UserSchema);

export default UserModel;
