import { Request, Response } from 'express';
import { AppealService } from '../services/appealService';

export class AppealController {
    private appealService: AppealService;

    constructor() {
        this.appealService = new AppealService();
        this.fetchAllAppealRecords = this.fetchAllAppealRecords.bind(this);
        this.newAppealRecord = this.newAppealRecord.bind(this);
        this.processAppealRecord = this.processAppealRecord.bind(this);
    }
    async fetchAllAppealRecords(req: Request, res: Response): Promise<void> {
        try {
            const appeals = await this.appealService.getAllAppealRecords();
            res.status(200).json(appeals);
        } catch (error) {
            if (error instanceof Error) {
                // Now TypeScript knows `error` is of type `Error`
                res.status(500).json({ error: error.message });
            }
        }
    };
    
    async newAppealRecord(req: Request, res: Response): Promise<void> {
        try {
            const {uin, courseId, checkInTime, reason } = req.body;
            if (!uin || !courseId || !checkInTime) {
                res.status(400).send('Missing parameters');
                return;
            }
        
            const result : boolean = await this.appealService.createAppealRecord(uin, courseId, checkInTime, reason);
            res.redirect('/');
        } catch (error) {
            if (error instanceof Error) {
                // Now TypeScript knows `error` is of type `Error`
                res.status(500).json({ error: error.message });
            }
        }
    };
    
    async processAppealRecord(req: Request, res: Response): Promise<void> {
        try {
            console.log(req.body);
            const { _id, status } = req.body;
            if (!_id) {
                res.status(400).send('Missing parameters');
                return;
            }
            await this.appealService.modifyAppealRecord(_id, status);
            res.redirect('/');
        } catch (error) {
            if (error instanceof Error) {
                // Now TypeScript knows `error` is of type `Error`
                res.status(500).json({ error: error.message });
            }
        }
    }
};