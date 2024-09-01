import { Router } from 'express';
import { AppealController } from '../controllers/appealController';

// const router = Router();

// let appealController: AppealController;

export function setupAppealRoutes(router: Router) {
    const appealController = new AppealController();
    // console.log(appealController);
    // console.log('appeal routes setup!');
    router.get('/appeal/', appealController.fetchAllAppealRecords);
    router.post('/appeal/new', appealController.newAppealRecord);
    router.post('/appeal/process', appealController.processAppealRecord);
}