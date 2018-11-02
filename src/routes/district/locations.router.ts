/**
 *      on 7/20/16.
 */
import {authentication} from "../../middlewares/authentication";
import {LocationsHandler} from "./locations.handler";
import * as express from "express";
const router = express.Router();
    
router.route("/create")
   .post(LocationsHandler.cityCreate)
 
export default router;
