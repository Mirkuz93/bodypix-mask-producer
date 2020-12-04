import { Router } from 'express';
import MaskController from '../controllers/mask.controller';
import Route from '../interfaces/routes.interface';
import errorMiddleware from '../middlewares/error.middleware';


class MaskRoute implements Route {
    public path = '/mask';
    public router = Router();
    public maskController = new MaskController();


    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}`, errorMiddleware,  this.maskController.getMask);
    }
    
}

export default MaskRoute;