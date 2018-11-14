import {authentication} from "../../middlewares/authentication";
import {accessrole} from "../../middlewares/accessrole";
import AttendenceHandler from "./attendence.handler";
import * as express from "express";
const router = express.Router();

router.route("/")
    .get(authentication,accessrole, AttendenceHandler.list)
    .post(AttendenceHandler.create);

router.route("/view/:rid")
    .get(authentication,accessrole,AttendenceHandler.view)

    
router.route("/:rid")
    .put(authentication,accessrole,AttendenceHandler.update)
    .delete(authentication,accessrole,AttendenceHandler.destroy);

// router.route("/export")
//     .get(authentication,accessrole, UserHandler.export);

router.route("/massDelete")
    .post(authentication,accessrole, AttendenceHandler.massDelete);

// router.route("/exportSelected")
//     .post(authentication, accessrole, UserHandler.exportSelected);

export default router;
