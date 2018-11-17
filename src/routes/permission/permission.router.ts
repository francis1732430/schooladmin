/**
 *    
 */
import {authentication} from "../../middlewares/authentication";
import {accessrole} from "../../middlewares/accessrole";
import {PermissionHandler} from "./permission.hander";
import {checkUser} from "../../middlewares/checkuser";
import * as express from "express";
const router = express.Router();

router.route("/")
    .get(authentication, PermissionHandler.detail);

router.route("/view/:rid")
    .get(authentication, PermissionHandler.moduleDetail);

router.route("/master")
    .get(authentication, PermissionHandler.master);

router.route("/selectModule")
    .get(authentication,checkUser,accessrole,PermissionHandler.selectModule);    
    router.route("/getModule")
    .get(authentication,checkUser,accessrole,PermissionHandler.getModule);
router.route("/selectSchool")
    .get(authentication,checkUser,accessrole,PermissionHandler.selectSchool);
export default router;
