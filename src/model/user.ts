import mongoose, { Schema, Document } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

enum AcademicRole {
    Lecture = 'lecture',
    Student = 'student',
}

interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    academicRole: AcademicRole;
    comparePassword: (candidatePassword: string) => Promise<boolean>;
}

const UserSchema: Schema<IUser> = new Schema<IUser>({
    name: {
        type: String,
        required: [true, 'Please provide name'],
        minlength: 3,
        maxlength: 30,
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Please provide email'],
        validate: {
            validator: validator.isEmail,
            message: 'Please provide a valid email',
        },
    },
    password: {
        type: String,
        required: [true, 'Please provide password'],
        minlength: 6,
    },
    academicRole: {
        type: String,
        enum: Object.values(AcademicRole),
        default: AcademicRole.Student,
    },
});

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

const User = mongoose.model<IUser>('User', UserSchema);

export default User;
