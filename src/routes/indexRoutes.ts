import { Router } from 'express';

// const router = Router();

export function setupIndexRoutes(router: Router) {
    // Route to render the index page
    router.get('/', (req, res) => {
        res.render('index');
    });
    // return router;
}