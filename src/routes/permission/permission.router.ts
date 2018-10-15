/**
 *    
 */
import {authentication} from "../../middlewares/authentication";
import {accessrole} from "../../middlewares/accessrole";
import {PermissionHandler} from "./permission.hander";
import * as express from "express";
const router = express.Router();

router.route("/")
    .get(authentication, PermissionHandler.detail);

router.route("/view/:rid")
    .get(authentication, PermissionHandler.moduleDetail);

router.route("/master")
    .get(authentication, PermissionHandler.master);

router.route("/selectModule")
    .get(PermissionHandler.selectModule);    

export default router;
