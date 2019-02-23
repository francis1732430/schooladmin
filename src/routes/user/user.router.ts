/**
 *      on 7/21/16.
 */
import {authentication} from "../../middlewares/authentication";
import {accessrole} from "../../middlewares/accessrole";
import {checkUser} from "../../middlewares/checkuser";
import UserHandler from "./user.handler";
import * as express from "express";
const router = express.Router();

router.route("/")
    .get(authentication,checkUser,accessrole, UserHandler.list)
    .post(authentication,checkUser,accessrole, UserHandler.create);

router.route("/view/:rid")
    .get(authentication,checkUser,accessrole,UserHandler.getById)

    
router.route("/:rid")
    .put(authentication,checkUser,accessrole,UserHandler.update)
    .delete(authentication,checkUser,accessrole,UserHandler.destroy);

router.route("/export")
    .get(authentication,checkUser,accessrole, UserHandler.export);

router.route("/massDelete")
    .post(authentication,checkUser,accessrole,UserHandler.massDelete);

router.route("/exportSelected")
    .post(authentication,checkUser,accessrole, UserHandler.exportSelected);

router.route("/getUsers")
    .get(authentication,checkUser,accessrole, UserHandler.getUsers);


router.route("/getStudent")
    .get(authentication,checkUser,accessrole, UserHandler.getStudent);
 
router.route("/getTeacher")
    .get(authentication,checkUser,accessrole, UserHandler.getTeacher);    

router.route("/getParent")
    .get(authentication,checkUser,accessrole, UserHandler.getParent);

router.route("/getTeacherandAdmin")
    .get(authentication,checkUser,accessrole, UserHandler.getTeacherAndAdmin);

router.route("/getStudentandAdmin")
    .get(authentication,checkUser,accessrole, UserHandler.getStudentAndParent);
    
router.route("/getSchoolAdmin")
    .get(authentication,checkUser,accessrole, UserHandler.getSchoolAdmin);    
export default router;
