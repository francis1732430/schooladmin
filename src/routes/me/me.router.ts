/**
 *    
 */
import {authentication} from "../../middlewares/authentication";
import {accessrole} from "../../middlewares/accessrole";
import {MeHandler} from "./me.handler";
import * as express from "express";
const router = express.Router();

router.route("/password")
    .put(authentication, MeHandler.changePassword);

router.route("/")
    .get(authentication, MeHandler.getMyProfile)
    .put(authentication, MeHandler.editProfile);

export default router;
