

import { authentication }from '../../middlewares/authentication';
import { DistrictsHandler }from './districts.handler';
import {accessrole} from "../../middlewares/accessrole";
import * as express from "express";
//import { LocationsHandler } from '../district/locations.handler';
const router = express.Router();


router.route("/create").post(DistrictsHandler.districtcreate)
router.route("/update/:rid").put(DistrictsHandler.district_update)
router.route("/:rid").delete(DistrictsHandler.destory);
router.route("/list").get(DistrictsHandler.list);    
router.route("/massdelete").post(DistrictsHandler.massdelete);
router.route("/view/:rid").get(DistrictsHandler.view);                

export default router;