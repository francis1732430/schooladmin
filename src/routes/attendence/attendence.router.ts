import {authentication} from "../../middlewares/authentication";
import {accessrole} from "../../middlewares/accessrole";
import {checkUser} from "../../middlewares/checkuser";
import AttendenceHandler from "./attendence.handler";
import * as express from "express";
const router = express.Router();

router.route("/")
    .get(authentication,checkUser,accessrole,AttendenceHandler.list)
    .post(authentication,checkUser,accessrole,AttendenceHandler.create);

router.route("/view/:rid")
    .get(authentication,checkUser,accessrole,AttendenceHandler.view)

    
router.route("/:rid")
    .put(authentication,checkUser,accessrole,AttendenceHandler.update)
    .delete(authentication,checkUser,accessrole,AttendenceHandler.destroy);

// router.route("/export")
//     .get(authentication,accessrole, UserHandler.export);

router.route("/massDelete")
    .post(authentication,checkUser,accessrole,AttendenceHandler.massDelete);

// router.route("/exportSelected")
//     .post(authentication, accessrole, UserHandler.exportSelected);

export default router;
