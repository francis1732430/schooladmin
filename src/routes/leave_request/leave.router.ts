import {authentication} from "../../middlewares/authentication";
import {accessrole} from "../../middlewares/accessrole";
import LeaveRequestHandler from "./leave.handler";
import {checkUser} from "../../middlewares/checkuser";
import * as express from "express";
const router = express.Router();

router.route("/")
    .get(authentication,checkUser,accessrole, LeaveRequestHandler.list)
    .post(authentication,checkUser,accessrole,LeaveRequestHandler.create);

router.route("/view/:rid")
    .get(authentication,checkUser,accessrole,LeaveRequestHandler.view)

    
router.route("/:rid")
    .put(authentication,checkUser,accessrole,LeaveRequestHandler.update)
    .delete(authentication,accessrole,LeaveRequestHandler.destroy);

// router.route("/export")
//     .get(authentication,accessrole, UserHandler.export);

router.route("/massDelete")
    .post(authentication,checkUser,accessrole,LeaveRequestHandler.massDelete);

// router.route("/exportSelected")
//     .post(authentication, accessrole, UserHandler.exportSelected);

export default router;
