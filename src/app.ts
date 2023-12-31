import cookieParser from 'cookie-parser';
import express from 'express';
import connectDB from './db/connect';
import dotenv from 'dotenv';
import notFoundMiddleware from './middleware/not-found';
import errorHandlerMiddleware from './middleware/error-handler';
import authRouter from './routes/auth-route';
import usersRouter from './routes/users-route';
import examsRouter from './routes/exams-route';
import morgan from 'morgan';

dotenv.config();

const app = express();

app.use(express.json());
app.use(morgan('dev'));

app.get('/api/v1', (req, res) => {
    console.log(req.cookies);

    res.send('Hello, Express!');
});

app.use(cookieParser(process.env.JWT_SECRET));
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/exams', examsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = Number(process.env.PORT) || 5000;

const MONGO_URL = process.env.MONGO_URL as string;

const start = async () => {
    try {
        await connectDB(MONGO_URL);
        app.listen(port, () =>
            console.log(`Server is listening on port ${port}...`),
        );
    } catch (error) {
        console.log(error);
    }
};

start();
