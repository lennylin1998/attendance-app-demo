import express from 'express';
import path from 'path';
import { setupIndexRoutes } from './routes/indexRoutes';
import { setupAttendanceRoutes } from './routes/attendanceRoutes';
import { setupAppealRoutes } from './routes/appealRoutes';
import { initialize, connectDB } from './config/database';

const app = express();
const port = 3000;
const router = express.Router();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


const startServer = async () => {
    try {
        await connectDB('demo');
        await initialize();
        
        setupIndexRoutes(router);
        setupAppealRoutes(router);
        setupAttendanceRoutes(router);
        app.use('/', router);
        
        app.listen(port, () => {
            console.log(`Server is running at http://localhost:${port}`);
        });
    } catch ( error ) {
        console.error('Error starting server...', error);
        process.exit(1);
    }
}

startServer();

