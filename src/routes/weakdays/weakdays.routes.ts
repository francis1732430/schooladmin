
import {authentication} from "../../middlewares/authentication";
import {accessrole} from "../../middlewares/accessrole";
import {checkUser} from "../../middlewares/checkuser";
import * as express from "express";
import { weakHandler } from './weakdays.handler';
//import { LocationsHandler } from '../district/locations.handler';
const router = express.Router();

router.route("/").post(authentication,checkUser,accessrole,weakHandler.create_weak);
router.route("/:rid").put(authentication,checkUser,accessrole,weakHandler.update_weak);
router.route("/:rid").delete(authentication,checkUser,accessrole,weakHandler.destory);
router.route("/").get(authentication,checkUser,accessrole,weakHandler.list);
router.route("/massdelete").post(authentication,checkUser,accessrole,weakHandler.massdelete);
router.route("/view/:rid").get(authentication,checkUser,accessrole,weakHandler.view_weaks);





export default router;