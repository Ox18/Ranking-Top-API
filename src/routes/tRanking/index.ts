import { Router } from 'express';
const router = Router();
import { Request, ITop } from './data';

import * as topController from './functions';


router.get('/', (req: Request, res)=>{
   const { numberOfAccounts, rank, position, gp } = req.query;
    
   const topObj:ITop = {
    numberOfAccounts : numberOfAccounts || 0,
    rank:  rank || 0,
    position:  position || 0,
    gp: gp || 0,
   };
   try{
        let rank = topController.getRank(topObj);
        res.status(200).json({
            status: "ok",
            message: "Successful get rank",
            data: rank,
        });
   }catch(ex){
        res.status(500).json({
            status: "error",
            message: ex.message,
            data: 0,
        });
   }
});

export = router;