

import { authentication }from '../../middlewares/authentication';
import { DistrictsHandler }from './districts.handler';
import {accessrole} from "../../middlewares/accessrole";
import * as express from "express";
import {checkUser} from "../../middlewares/checkuser";
//import { LocationsHandler } from '../district/locations.handler';
const router = express.Router();


router.route("/create").post(authentication,checkUser,accessrole,DistrictsHandler.districtcreate)
router.route("/:rid").put(authentication,checkUser,accessrole,DistrictsHandler.district_update)
router.route("/:rid").delete(authentication,checkUser,accessrole,DistrictsHandler.destory);
router.route("/").get(authentication,checkUser,accessrole,DistrictsHandler.list);    
router.route("/massdelete").post(authentication,checkUser,accessrole,DistrictsHandler.massdelete);
router.route("/view/:rid").get(authentication,checkUser,accessrole,DistrictsHandler.view);                

export default router;