import { authentication }from '../../middlewares/authentication';
import { District_taluka }from './directory_taulk.handler';
import * as express from "express";
import {accessrole} from "../../middlewares/accessrole";
import { format } from 'url';
import {checkUser} from "../../middlewares/checkuser";

const router = express.Router();


router.route("/").post(authentication,checkUser,accessrole,District_taluka.taluka_create);
router.route("/:rid").put(authentication,checkUser,accessrole,District_taluka.district_taluka_update);
router.route("/:rid").delete(authentication,checkUser,accessrole,District_taluka.destory);
router.route("/").get(authentication,checkUser,accessrole,District_taluka.list);
router.route("/massdelete").post(authentication,checkUser,accessrole,District_taluka.massdelete);
router.route("/view/:rid").get(authentication,checkUser,accessrole,District_taluka.view_district_taluka);

export default router;