import { authentication }from '../../middlewares/authentication';

import {accessrole} from "../../middlewares/accessrole";
import * as express from "express";
import { TimeHabdler } from './time.handler';
import {checkUser} from "../../middlewares/checkuser";
//import { LocationsHandler } from '../district/locations.handler';
const router = express.Router();


router.route("/").post(authentication,checkUser,accessrole,TimeHabdler.create_time)
router.route("/:rid").put(authentication,checkUser,accessrole,TimeHabdler.update_time);
router.route("/:rid").delete(authentication,checkUser,accessrole,TimeHabdler.destory);
router.route("/").get(authentication,checkUser,accessrole,TimeHabdler.list);
router.route("/massdelete").post(authentication,checkUser,accessrole,TimeHabdler.massdelete);
router.route("/view/:rid").get(authentication,checkUser,accessrole,TimeHabdler.view_times);




export default router;