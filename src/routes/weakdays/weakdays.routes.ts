

import { authentication }from '../../middlewares/authentication';

import {accessrole} from "../../middlewares/accessrole";
import * as express from "express";
import { weakHandler } from './weakdays.handler';
//import { LocationsHandler } from '../district/locations.handler';
const router = express.Router();

router.route("/create_weak").post(weakHandler.create_weak);
router.route("/update/:rid").put(weakHandler.update_weak);
router.route("/:rid").delete(weakHandler.destory);
router.route("/list").get(weakHandler.list);
router.route("/massdelete").post(weakHandler.massdelete);
router.route("/view/:rid").get(weakHandler.view_weaks);





export default router;