import { authentication }from '../../middlewares/authentication';

import {accessrole} from "../../middlewares/accessrole";
import * as express from "express";
import { TimeHabdler } from './time.handler';
//import { LocationsHandler } from '../district/locations.handler';
const router = express.Router();


router.route("/create_time").post(TimeHabdler.create_time)
router.route("/update/:rid").put(TimeHabdler.update_time);
router.route("/:rid").delete(TimeHabdler.destory);
router.route("/list").get(TimeHabdler.list);
router.route("/massdelete").post(TimeHabdler.massdelete);
router.route("/view/:rid").get(TimeHabdler.view_times);




export default router;