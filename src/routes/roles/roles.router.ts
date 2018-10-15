/**
 *    
 */
import {authentication} from "../../middlewares/authentication";
import {accessrole} from "../../middlewares/accessrole";
import {RoleHandler} from "./roles.hander";
import * as express from "express";
const router = express.Router();

router.route("/list")
    .get(authentication,accessrole, RoleHandler.selectList)


router.route("/")
    .get(authentication,accessrole, RoleHandler.list)

router.route("/:rid")
    .put(authentication,accessrole, RoleHandler.update)
    .delete(authentication,accessrole, RoleHandler.destroy)

router.route("/view/:rid")
    .get(authentication,accessrole, RoleHandler.view)
    
router.route("/massDelete")
    .post(authentication,accessrole, RoleHandler.massDelete)

router.route("/export")
    .get(authentication,accessrole, RoleHandler.export)

router.route("/")
    .post(authentication,accessrole, RoleHandler.create);


router.route("/exportSelected")
    .post(authentication, accessrole, RoleHandler.exportSelected);


export default router;
