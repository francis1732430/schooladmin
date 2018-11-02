/**
 *    
 */
import {authentication} from "../../middlewares/authentication";
import {accessrole} from "../../middlewares/accessrole";
import {checkUser} from "../../middlewares/checkuser";
import {RoleHandler} from "./roles.hander";
import * as express from "express";
const router = express.Router();

router.route("/list")
    .get(authentication,accessrole, RoleHandler.selectList)


router.route("/")
    .get(authentication,checkUser,accessrole, RoleHandler.list)

router.route("/schoolList")
    .get(authentication,checkUser,accessrole, RoleHandler.schoolList);

router.route("/assignedSchool")
    .get(authentication,checkUser,accessrole, RoleHandler.assignedSchoolList);
    
router.route("/:rid")
    .put(authentication,accessrole, RoleHandler.update)
    .delete(authentication,accessrole, RoleHandler.destroy)

router.route("/view/:rid")
    .get(authentication,checkUser,accessrole, RoleHandler.view)
    
router.route("/massDelete")
    .post(authentication,accessrole, RoleHandler.massDelete)

router.route("/export")
    .get(authentication,accessrole, RoleHandler.export)

router.route("/")
    .post(authentication,checkUser,accessrole, RoleHandler.create);


router.route("/exportSelected")
    .post(authentication, accessrole, RoleHandler.exportSelected);

router.route("/createRole")
      .post(authentication, checkUser,accessrole,RoleHandler.createMasterRole);

router.route("/masterRoles")
       .get(authentication,checkUser,accessrole,RoleHandler.masterRoles);
       
router.route("/schoolRole")
     .post(authentication,checkUser,accessrole,RoleHandler.schoolCreate);            

export default router;
