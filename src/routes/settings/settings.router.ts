/**
 *      on 7/20/16.
 */
import {authentication} from "../../middlewares/authentication";
import {SettingsHandler} from "./settings.handler";
import * as express from "express";
const router = express.Router();
    
router.route("/endpoints")
   .get(SettingsHandler.endpoints)


export default router;
